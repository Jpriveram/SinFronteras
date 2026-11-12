import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-accessibility-reader',
  templateUrl: './accessibility-reader.component.html',
  styleUrls: ['./accessibility-reader.component.scss']
})
export class AccessibilityReaderComponent implements OnInit, OnDestroy {
  enabled = false;
  supported = false;

  private synthesis: SpeechSynthesis | null = null;
  private lastElement: Element | null = null;
  private lastText = '';
  private lastSpokenText = '';
  private lastSpokenAt = 0;
  private pendingAnnouncement: number | undefined;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.supported = true;
    }
  }

  ngOnDestroy(): void {
    this.clearPendingAnnouncement();
    this.stopReading();
  }

  toggle(): void {
    if (!this.supported) return;

    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopReading();
      this.lastElement = null;
      this.lastText = '';
      this.clearPendingAnnouncement();
      this.lastSpokenText = '';
      this.lastSpokenAt = 0;
    }
  }

  @HostListener('document:mouseover', ['$event'])
  onPointerOver(event: MouseEvent): void {
    if (!this.enabled || !this.synthesis || !(event.target instanceof Element)) return;

    const target = event.target;
    if (target.closest('app-accessibility-reader')) return;

    const option = target.closest('[role="option"], [role="menuitemradio"], [role="menuitemcheckbox"]');
    if (option) {
      if (option !== this.lastElement) {
        this.lastElement = option;
        this.scheduleOptionAnnouncement(option, false);
      }
      return;
    }

    const control = this.getControlElement(target);
    if (control) {
      if (control === this.lastElement) return;
      this.lastElement = control;
      this.scheduleControlAnnouncement(control, 'focus');
      return;
    }

    const element = this.getReadableElement(target);
    if (!element || element === this.lastElement) return;

    const text = this.getReadableText(element);
    if (!text || text === this.lastText) {
      this.lastElement = element;
      return;
    }

    this.lastElement = element;
    this.lastText = text;
    this.speak(text);
  }

  @HostListener('document:focusin', ['$event'])
  onFocus(event: FocusEvent): void {
    if (!this.enabled || !(event.target instanceof Element)) return;
    const option = event.target.closest('[role="option"], [role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]');
    if (option) {
      this.scheduleOptionAnnouncement(option, false);
      return;
    }

    const control = this.getControlElement(event.target);
    if (control) this.scheduleControlAnnouncement(control, 'focus');
  }

  @HostListener('document:input', ['$event'])
  onInput(event: Event): void {
    if (!this.enabled || !(event.target instanceof Element)) return;
    const control = this.getControlElement(event.target);
    if (control && this.isSelectionControl(control)) {
      this.scheduleControlAnnouncement(control, 'selection');
    }
  }

  @HostListener('document:change', ['$event'])
  onChange(event: Event): void {
    if (!this.enabled || !(event.target instanceof Element)) return;
    const control = this.getControlElement(event.target);
    if (control) this.scheduleControlAnnouncement(control, 'selection');
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.enabled || !(event.target instanceof Element)) return;
    const option = event.target.closest('[role="option"], [role="menuitemradio"], [role="menuitemcheckbox"]');
    if (option) {
      this.scheduleOptionAnnouncement(option, true);
      return;
    }

    const control = this.getControlElement(event.target);
    if (control instanceof HTMLSelectElement) {
      this.scheduleSelectOptionsAnnouncement(control);
      return;
    }

    if (control?.matches('[role="checkbox"], [role="radio"]')) {
      this.scheduleControlAnnouncement(control, 'selection');
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (
      !this.enabled ||
      !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' ', 'Enter', 'F4'].includes(event.key) ||
      !(event.target instanceof Element)
    ) {
      return;
    }

    const control = this.getControlElement(event.target);
    if (control instanceof HTMLSelectElement) {
      const opensNativeMenu = event.key === 'Enter' ||
        event.key === ' ' ||
        event.key === 'F4' ||
        (event.key === 'ArrowDown' && event.altKey) ||
        (event.key === 'ArrowUp' && event.altKey);

      if (opensNativeMenu) this.scheduleSelectOptionsAnnouncement(control);
      else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        this.scheduleControlAnnouncement(control, 'active');
      }
      return;
    }

    if (control && this.isSelectionControl(control)) {
      const selected = event.key === 'Enter' || event.key === ' ';
      this.scheduleControlAnnouncement(control, selected ? 'selection' : 'active');
      return;
    }

    const composite = event.target.closest('[role="combobox"], [role="listbox"], [role="menu"]');
    if (composite) {
      this.scheduleActiveOptionAnnouncement(composite, event.key === 'Enter' || event.key === ' ');
    }
  }

  private getReadableElement(target: Element): Element | null {
    if (target.closest(
      '[aria-hidden="true"], [hidden], [inert], [data-speech-ignore], ' +
      'script, style, noscript, template, input, textarea, select, option, ' +
      '[contenteditable="true"]'
    )) {
      return null;
    }

    const element = target.closest(
      'button, a, h1, h2, h3, h4, h5, h6, p, label, li, img, ' +
      '[role="button"], [role="link"], [role="heading"], [role="menuitem"], ' +
      '[role="tab"], [role="img"], [role="option"], [role="menuitemradio"], ' +
      '[role="menuitemcheckbox"], [aria-label], [aria-labelledby]'
    ) ?? target;

    if (element.matches('form')) return null;
    if (element.matches('svg, path, [role="presentation"], [role="none"]')) return null;

    return this.isVisible(element) ? element : null;
  }

  private getReadableText(element: Element): string {
    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
      return this.getControlLabel(element);
    }

    const label = element.getAttribute('aria-label')?.trim();
    if (label) return label;

    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const referencedText = labelledBy
        .split(/\s+/)
        .map(id => document.getElementById(id)?.textContent?.trim() ?? '')
        .filter(Boolean)
        .join(' ');
      if (referencedText) return referencedText;
    }

    if (element instanceof HTMLImageElement) return element.alt.trim();

    const text = element instanceof HTMLElement ? element.innerText : element.textContent;
    const visibleText = (text ?? '').replace(/\s+/g, ' ').trim();
    if (visibleText) return visibleText;

    return element.querySelector('img[alt]')?.getAttribute('alt')?.trim() ?? '';
  }

  private getControlElement(target: Element): Element | null {
    const control = target.closest(
      'select, input[type="search"], input[type="checkbox"], input[type="radio"], ' +
      '[role="combobox"], [role="listbox"], [role="searchbox"], [role="checkbox"], [role="radio"]'
    );
    if (!control || control.closest('app-accessibility-reader')) return null;

    if (control instanceof HTMLInputElement && control.type === 'hidden') return null;
    return this.isVisible(control) ? control : null;
  }

  private isSelectionControl(element: Element): boolean {
    return element instanceof HTMLSelectElement ||
      element.matches('input[type="checkbox"], input[type="radio"], [role="combobox"], [role="listbox"], [role="checkbox"], [role="radio"]');
  }

  private scheduleControlAnnouncement(element: Element, announcement: 'focus' | 'active' | 'selection'): void {
    this.scheduleAnnouncement(() => {
      if (element instanceof HTMLSelectElement) {
        if (announcement === 'focus') {
          this.speak(this.getControlLabel(element) || 'Selecciona una opción');
        } else {
          const option = element.selectedOptions.item(0);
          if (option) {
            this.speak(announcement === 'selection'
              ? `Opción seleccionada: ${option.text.trim()}`
              : option.text.trim());
          }
        }
        return;
      }

      if (element instanceof HTMLInputElement) {
        const label = this.getControlLabel(element);
        if (element.type === 'checkbox' || element.type === 'radio') {
          this.speak(`${label}. ${element.checked ? 'Seleccionado' : 'No seleccionado'}`);
        } else {
          this.speak(label);
        }
        return;
      }

      if (announcement === 'focus') {
        const label = this.getControlLabel(element);
        if (element.matches('[role="checkbox"], [role="radio"]')) {
          const checked = element.getAttribute('aria-checked');
          const state = checked === 'mixed'
            ? 'Parcialmente seleccionado'
            : checked === 'true'
              ? 'Seleccionado'
              : 'No seleccionado';
          this.speak([label, state].filter(Boolean).join('. '));
        } else {
          const expanded = element.getAttribute('aria-expanded');
          const expansionState = expanded === 'true'
            ? 'Desplegable abierto'
            : expanded === 'false'
              ? 'Desplegable cerrado'
              : '';
          const activeOption = expanded === 'true' ? this.getActiveOptionText(element) : '';
          this.speak([label, expansionState, activeOption].filter(Boolean).join('. '));
        }
      } else {
        const optionText = this.getActiveOptionText(element);
        if (optionText) {
          this.speak(announcement === 'selection' ? `Opción seleccionada: ${optionText}` : optionText);
        } else if (element.matches('[role="checkbox"], [role="radio"]')) {
          const label = this.getControlLabel(element);
          const checked = element.getAttribute('aria-checked') === 'true';
          this.speak(`${label}. ${checked ? 'Seleccionado' : 'No seleccionado'}`);
        }
      }
    });
  }

  private scheduleSelectOptionsAnnouncement(select: HTMLSelectElement): void {
    this.scheduleAnnouncement(() => {
      const label = this.getControlLabel(select);
      const options = Array.from(select.options)
        .map(option => option.text.trim())
        .filter(Boolean);

      if (!options.length) {
        this.speak(`${label}. Selecciona una opción`);
        return;
      }

      this.speak(`${label}. Opciones disponibles: ${options.join('. ')}`);
    });
  }

  private scheduleActiveOptionAnnouncement(composite: Element, selected: boolean): void {
    this.scheduleAnnouncement(() => {
      const optionText = this.getActiveOptionText(composite);
      if (!optionText) return;
      this.speak(selected ? `Opción seleccionada: ${optionText}` : optionText);
    });
  }

  private scheduleOptionAnnouncement(option: Element, selected: boolean): void {
    this.scheduleAnnouncement(() => {
      const text = this.getReadableText(option);
      if (text) this.speak(selected ? `Opción seleccionada: ${text}` : text);
    });
  }

  private scheduleAnnouncement(announce: () => void): void {
    this.clearPendingAnnouncement();
    this.pendingAnnouncement = window.setTimeout(() => {
      this.pendingAnnouncement = undefined;
      if (this.enabled) announce();
    }, 180);
  }

  private clearPendingAnnouncement(): void {
    if (this.pendingAnnouncement !== undefined) {
      window.clearTimeout(this.pendingAnnouncement);
      this.pendingAnnouncement = undefined;
    }
  }

  private getControlLabel(element: Element): string {
    const label = element.getAttribute('aria-label')?.trim();
    if (label) return label;

    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const referencedText = labelledBy
        .split(/\s+/)
        .map(id => document.getElementById(id)?.textContent?.trim() ?? '')
        .filter(Boolean)
        .join(' ');
      if (referencedText) return referencedText;
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
      const nativeLabel = Array.from(element.labels ?? [])
        .map(item => item.innerText.trim())
        .filter(Boolean)
        .join(' ');
      if (nativeLabel) return nativeLabel;
    }

    if (element.id) {
      const associatedLabel = Array.from(document.querySelectorAll('label[for]'))
        .find(item => item.getAttribute('for') === element.id)
        ?.textContent?.trim();
      if (associatedLabel) return associatedLabel;
    }

    const labelledElement = element.closest('label');
    if (labelledElement) {
      const text = labelledElement.innerText.replace(/\s+/g, ' ').trim();
      if (text) return text;
    }

    return element.getAttribute('title')?.trim() ?? '';
  }

  private getActiveOptionText(composite: Element): string {
    const activeId = composite.getAttribute('aria-activedescendant');
    const active = activeId
      ? document.getElementById(activeId)
      : composite.querySelector(
        '[role="option"][aria-selected="true"], [role="menuitem"][aria-selected="true"], ' +
        '[role="menuitemradio"][aria-checked="true"], [role="menuitemcheckbox"][aria-checked="true"]'
      );
    return active && this.isVisible(active) ? this.getReadableText(active) : '';
  }

  private isVisible(element: Element): boolean {
    for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
      if (
        ancestor.hasAttribute('hidden') ||
        ancestor.hasAttribute('inert') ||
        ancestor.getAttribute('aria-hidden') === 'true'
      ) {
        return false;
      }

      const style = window.getComputedStyle(ancestor);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.contentVisibility === 'hidden' ||
        style.opacity === '0'
      ) {
        return false;
      }
    }

    return element.getClientRects().length > 0;
  }

  private speak(text: string): void {
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    if (!normalizedText || !this.enabled || !this.synthesis) return;

    const now = Date.now();
    if (normalizedText === this.lastSpokenText && now - this.lastSpokenAt < 700) return;

    this.lastSpokenText = normalizedText;
    this.lastSpokenAt = now;
    this.stopReading();

    const utterance = new SpeechSynthesisUtterance(normalizedText);
    utterance.lang = 'es-BO';
    this.synthesis.speak(utterance);
  }

  private stopReading(): void {
    this.synthesis?.cancel();
  }
}
