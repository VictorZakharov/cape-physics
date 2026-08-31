import {
  CAPE_PHYSICS_SETTING_RANGES,
  DEFAULT_CAPE_PHYSICS_SETTINGS,
  normalizeCapePhysicsSettings,
  type CapePhysicsSettings,
} from '../physics/CapeSettings';
import { invariant } from '../utils/assert';
import {
  BOT_COUNT_RANGE,
  normalizeBotCount,
} from '../player/BotMovementInput';

export interface CustomizationSettings extends CapePhysicsSettings {
  readonly lights: boolean;
  readonly shadows: boolean;
  readonly reflections: boolean;
  readonly bots: number;
}

export const DEFAULT_CUSTOMIZATION_SETTINGS: CustomizationSettings = Object.freeze({
  ...DEFAULT_CAPE_PHYSICS_SETTINGS,
  lights: true,
  shadows: true,
  reflections: true,
  bots: 0,
});

type PhysicsNumericSetting = keyof CapePhysicsSettings;
type NumericSetting = PhysicsNumericSetting | 'bots';
type ToggleSetting = 'lights' | 'shadows' | 'reflections';

const PHYSICS_NUMERIC_SETTINGS: readonly PhysicsNumericSetting[] = [
  'length',
  'width',
  'stiffness',
  'damping',
  'weight',
];

const NUMERIC_SETTINGS: readonly NumericSetting[] = [
  ...PHYSICS_NUMERIC_SETTINGS,
  'bots',
];

const TOGGLE_SETTINGS: readonly ToggleSetting[] = ['lights', 'shadows', 'reflections'];

export class CustomizationPanel {
  private readonly root: HTMLElement;
  private readonly panel: HTMLElement;
  private readonly toggle: HTMLButtonElement;
  private readonly resetButton: HTMLButtonElement;
  private readonly status: HTMLElement;
  private readonly numericInputs = new Map<NumericSetting, HTMLInputElement>();
  private readonly toggleInputs = new Map<ToggleSetting, HTMLInputElement>();
  private readonly outputElements = new Map<NumericSetting, HTMLOutputElement>();
  private settings: CustomizationSettings = { ...DEFAULT_CUSTOMIZATION_SETTINGS };

  public constructor(
    private readonly onChange: (
      settings: CustomizationSettings,
      settleDimensions: boolean,
    ) => void,
  ) {
    this.root = invariant(
      document.querySelector<HTMLElement>('[data-customization]'),
      'Customization panel is missing.',
    );
    this.panel = invariant(
      this.root.querySelector<HTMLElement>('[data-customization-panel]'),
      'Customization panel content is missing.',
    );
    this.toggle = invariant(
      this.root.querySelector<HTMLButtonElement>('[data-customization-toggle]'),
      'Customization panel toggle is missing.',
    );
    this.resetButton = invariant(
      this.root.querySelector<HTMLButtonElement>('[data-customization-reset]'),
      'Customization reset button is missing.',
    );
    this.status = invariant(
      this.root.querySelector<HTMLElement>('[data-customization-status]'),
      'Customization status is missing.',
    );

    for (const name of NUMERIC_SETTINGS) {
      const input = invariant(
        this.root.querySelector<HTMLInputElement>(`[data-customization-setting="${name}"]`),
        `Customization input ${name} is missing.`,
      );
      const output = invariant(
        this.root.querySelector<HTMLOutputElement>(`[data-customization-value="${name}"]`),
        `Customization output ${name} is missing.`,
      );
      const range = name === 'bots'
        ? BOT_COUNT_RANGE
        : CAPE_PHYSICS_SETTING_RANGES[name];
      input.min = String(range.min);
      input.max = String(range.max);
      input.step = String(range.step);
      input.addEventListener('input', this.handleNumericInput);
      if (name === 'length' || name === 'width') {
        input.addEventListener('change', this.handleDimensionCommit);
      }
      this.numericInputs.set(name, input);
      this.outputElements.set(name, output);
    }

    for (const name of TOGGLE_SETTINGS) {
      const input = invariant(
        this.root.querySelector<HTMLInputElement>(`[data-customization-setting="${name}"]`),
        `Customization switch ${name} is missing.`,
      );
      input.addEventListener('change', this.handleToggleInput);
      this.toggleInputs.set(name, input);
    }

    this.toggle.addEventListener('click', this.handlePanelToggle);
    this.resetButton.addEventListener('click', this.handleReset);
    this.syncControls();
    const compactLayout = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
    this.setExpanded(!compactLayout);
  }

  public getSettings(): CustomizationSettings {
    return { ...this.settings };
  }

  public dispose(): void {
    this.numericInputs.forEach((input) => {
      input.removeEventListener('input', this.handleNumericInput);
      input.removeEventListener('change', this.handleDimensionCommit);
    });
    this.toggleInputs.forEach((input) => {
      input.removeEventListener('change', this.handleToggleInput);
    });
    this.toggle.removeEventListener('click', this.handlePanelToggle);
    this.resetButton.removeEventListener('click', this.handleReset);
  }

  private readonly handleNumericInput = (event: Event): void => {
    const input = event.currentTarget as HTMLInputElement;
    const name = input.dataset.customizationSetting as NumericSetting;
    if (name === 'bots') {
      this.settings = {
        ...this.settings,
        bots: normalizeBotCount(input.valueAsNumber),
      };
      this.updateOutput(name);
      this.status.textContent = 'Custom settings active';
      this.emitChange();
      return;
    }
    const physics = normalizeCapePhysicsSettings({
      ...this.settings,
      [name]: input.valueAsNumber,
    });
    this.settings = {
      ...this.settings,
      ...physics,
    };
    this.updateOutput(name);
    this.status.textContent = 'Custom settings active';

    this.emitChange();
  };

  private readonly handleDimensionCommit = (): void => {
    this.emitChange(true);
  };

  private readonly handleToggleInput = (event: Event): void => {
    const input = event.currentTarget as HTMLInputElement;
    const name = input.dataset.customizationSetting as ToggleSetting;
    this.settings = {
      ...this.settings,
      [name]: input.checked,
    };
    this.status.textContent = 'Custom settings active';
    this.emitChange();
  };

  private readonly handlePanelToggle = (): void => {
    this.setExpanded(this.toggle.getAttribute('aria-expanded') !== 'true');
  };

  private readonly handleReset = (): void => {
    this.settings = { ...DEFAULT_CUSTOMIZATION_SETTINGS };
    this.syncControls();
    this.status.textContent = 'Defaults restored';
    this.emitChange(true);
  };

  private emitChange(settleDimensions = false): void {
    this.onChange({ ...this.settings }, settleDimensions);
  }

  private syncControls(): void {
    this.numericInputs.forEach((input, name) => {
      input.value = String(this.settings[name]);
      this.updateOutput(name);
    });
    this.toggleInputs.forEach((input, name) => {
      input.checked = this.settings[name];
    });
  }

  private updateOutput(name: NumericSetting): void {
    const output = this.outputElements.get(name);
    if (!output) return;
    const value = this.settings[name];
    output.value = name === 'bots'
      ? value.toFixed(0)
      : name === 'length' || name === 'width'
      ? `${value.toFixed(2)} m`
      : `${value.toFixed(2)}×`;
  }

  private setExpanded(expanded: boolean): void {
    this.root.classList.toggle('is-collapsed', !expanded);
    this.toggle.setAttribute('aria-expanded', String(expanded));
    this.toggle.setAttribute(
      'aria-label',
      expanded ? 'Collapse cape customization' : 'Expand cape customization',
    );
    this.panel.hidden = !expanded;
  }
}
