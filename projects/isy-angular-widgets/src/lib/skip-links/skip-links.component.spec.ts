import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {SkipLinksComponent} from './skip-links.component';

describe('SkipLinksComponent', () => {
  let spectator: Spectator<SkipLinksComponent>;
  const createComponent = createComponentFactory(SkipLinksComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should focus on the target element if it exists', () => {
    const mockEvent = new Event('click');
    spyOn(mockEvent, 'preventDefault');
    const targetId = '#test-target';
    const mockElement = document.createElement('div');
    mockElement.id = 'test-target';
    document.body.appendChild(mockElement);

    spyOn(mockElement, 'scrollIntoView');
    spyOn(mockElement, 'focus');

    spectator.component.focusTarget(mockEvent, targetId);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth', block: 'start'});
    expect(mockElement.getAttribute('tabindex')).toBe('-1');
    expect(mockElement.focus).toHaveBeenCalled();

    document.body.removeChild(mockElement);
  });

  it('should log a warning if the target element does not exist', () => {
    const mockEvent = new Event('click');
    spyOn(mockEvent, 'preventDefault');
    const targetId = '#non-existent-target';
    spyOn(console, 'warn');

    spectator.component.focusTarget(mockEvent, targetId);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      `[SkipLinksComponent]: Target '${targetId}' not found. Please check if the element with '${targetId}' exists in the DOM.`
    );
  });

  it('should set tabindex to -1 if the target element does not have it', () => {
    const mockEvent = new Event('click');
    spyOn(mockEvent, 'preventDefault');
    const targetId = '#test-target';
    const mockElement = document.createElement('div');
    mockElement.id = 'test-target';
    document.body.appendChild(mockElement);

    spectator.component.focusTarget(mockEvent, targetId);

    expect(mockElement.getAttribute('tabindex')).toBe('-1');

    document.body.removeChild(mockElement);
  });

  it('should not overwrite tabindex if the target element already has it', () => {
    const mockEvent = new Event('click');
    spyOn(mockEvent, 'preventDefault');
    const targetId = '#test-target';
    const mockElement = document.createElement('div');
    mockElement.id = 'test-target';
    mockElement.setAttribute('tabindex', '0');
    document.body.appendChild(mockElement);

    spectator.component.focusTarget(mockEvent, targetId);

    expect(mockElement.getAttribute('tabindex')).toBe('0');

    document.body.removeChild(mockElement);
  });

  it('should handle empty links input gracefully', () => {
    spectator.component.links = [];
    expect(spectator.component.links.length).toBe(0);
  });

  it('should handle undefined ariaLabel input gracefully', () => {
    spectator.component.ariaLabel = undefined;
    expect(spectator.component.ariaLabel).toBeUndefined();
  });
});
