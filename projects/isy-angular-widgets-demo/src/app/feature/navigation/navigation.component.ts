import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import {MegaMenuItem, MenuItem} from 'primeng/api';
import {PanelMenuModule} from 'primeng/panelmenu';
import {HauptfensterComponent} from '@isy-angular-widgets/hauptfenster/hauptfenster.component';
import {SectionHeadingComponent} from '../../shared/components/section-heading/section-heading.component';

const FUNCTION_NUMBERS = ['1', '2', '3'];

interface NavigationEntry {
  label: string;
}

@Component({
  standalone: true,
  selector: 'demo-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [HauptfensterComponent, PanelMenuModule, SectionHeadingComponent]
})
export class NavigationComponent {
  readonly userInfo = {displayName: 'Demo Nutzer'};
  readonly applicationSubItems: NavigationEntry[][] = [
    [{label: 'Unterpunkt 1.1'}, {label: 'Unterpunkt 1.2'}, {label: 'Unterpunkt 1.3'}],
    [{label: 'Unterpunkt 2.1'}, {label: 'Unterpunkt 2.2'}, {label: 'Unterpunkt 2.3'}],
    [{label: 'Unterpunkt 3.1'}, {label: 'Unterpunkt 3.2'}, {label: 'Unterpunkt 3.3'}]
  ];
  readonly applicationGroupSubItems: NavigationEntry[][] = [
    [{label: 'Anwendung 1.1'}, {label: 'Anwendung 1.2'}, {label: 'Anwendung 1.3'}],
    [{label: 'Anwendung 2.1'}, {label: 'Anwendung 2.2'}, {label: 'Anwendung 2.3'}],
    [{label: 'Anwendung 3.1'}, {label: 'Anwendung 3.2'}, {label: 'Anwendung 3.3'}]
  ];
  readonly colors = ['#0055b9', '#007c91', '#7a3e9d', '#365314'];
  applicationMainItems: MegaMenuItem[];
  mainItems: MegaMenuItem[];
  linkNavigationItems: MenuItem[] = [];
  selectedMainIndex = 0;
  selectedSubIndex = 0;
  selectedFunctionIndex = 0;
  selectedUseCase = ['1', '1', '1', '1'].join('.');
  private readonly changeDetector = inject(ChangeDetectorRef);

  constructor() {
    this.applicationMainItems = this.createApplicationMainItems();
    this.mainItems = this.createMainItems();
    this.linkNavigationItems = this.createLinkNavigationItems();
  }

  private createApplicationMainItems(): MegaMenuItem[] {
    return ['Menüpunkt 1', 'Menüpunkt 2', 'Menüpunkt 3'].map((label, mainIndex): MegaMenuItem => ({
      label,
      command: (): void => this.selectApplicationMain(mainIndex),
      items: [
        [
          {
            label: 'Komponenten',
            items: this.applicationSubItems[mainIndex].map((item, subIndex): MegaMenuItem => ({
              label: item.label,
              command: (): void => this.selectApplicationSub(mainIndex, subIndex)
            }))
          }
        ]
      ]
    }));
  }

  private createMainItems(): MegaMenuItem[] {
    return this.applicationGroupSubItems.map((applications, groupIndex): MegaMenuItem => ({
      label: `Anwendungsgruppe ${groupIndex + 1}`,
      command: (): void => this.selectGroupMain(groupIndex),
      items: [
        [
          {
            label: `Anwendungsgruppe ${groupIndex + 1}`,
            items: applications.map((application, applicationIndex): MegaMenuItem => ({
              label: application.label,
              command: (): void => this.selectGroupApplication(groupIndex, applicationIndex)
            }))
          }
        ]
      ]
    }));
  }

  private createLinkNavigationItems(): MenuItem[] {
    const expandedStates = this.linkNavigationItems.map((item) => item.expanded ?? true);
    const groupNumber = this.selectedMainIndex + 1;
    const applicationNumber = this.selectedSubIndex + 1;

    return ['1', '2', '3'].map((group, groupIndex): MenuItem => ({
      label: `Gruppe ${groupNumber}.${applicationNumber}.${group}`,
      expanded: expandedStates[groupIndex] ?? true,
      items: FUNCTION_NUMBERS.map((useCase): MenuItem => {
        const useCaseKey = `${groupNumber}.${applicationNumber}.${group}.${useCase}`;
        const active = this.selectedUseCase === useCaseKey;

        return {
          label: `Use Case ${useCaseKey}`,
          styleClass: active ? 'p-panelmenu-item-active' : undefined,
          linkClass: active ? 'p-menuitem-link-active' : undefined,
          linkStyle: active ? {backgroundColor: '#0055b9', color: '#ffffff'} : undefined,
          command: (): void => this.selectUseCase(useCaseKey)
        };
      })
    }));
  }

  selectApplicationMain(mainIndex: number): void {
    this.selectedMainIndex = mainIndex;
    this.selectedSubIndex = 0;
    this.selectedFunctionIndex = 0;
    this.applicationMainItems = this.createApplicationMainItems();
    this.changeDetector.detectChanges();
  }

  selectApplicationSub(mainIndex: number, subIndex: number): void {
    this.selectedMainIndex = mainIndex;
    this.selectedSubIndex = subIndex;
    this.selectedFunctionIndex = 0;
    this.applicationMainItems = this.createApplicationMainItems();
    this.changeDetector.detectChanges();
  }

  selectFunction(functionIndex: number): void {
    this.selectedFunctionIndex = functionIndex;
  }

  selectGroupMain(groupIndex: number): void {
    this.selectedMainIndex = groupIndex;
    this.selectedSubIndex = 0;
    this.selectedUseCase = `${groupIndex + 1}.1.1.1`;
    this.mainItems = this.createMainItems();
    this.linkNavigationItems = this.createLinkNavigationItems();
  }

  selectGroupApplication(groupIndex: number, applicationIndex: number): void {
    this.selectedMainIndex = groupIndex;
    this.selectedSubIndex = applicationIndex;
    this.selectedUseCase = `${groupIndex + 1}.${applicationIndex + 1}.1.1`;
    this.mainItems = this.createMainItems();
    this.linkNavigationItems = this.createLinkNavigationItems();
  }

  selectUseCase(useCaseKey: string): void {
    this.selectedUseCase = useCaseKey;
    this.linkNavigationItems = this.createLinkNavigationItems();
  }

  get applicationLinkNavigationItems(): MenuItem[] {
    const mainNumber = this.selectedMainIndex + 1;
    const subNumber = this.selectedSubIndex + 1;

    return FUNCTION_NUMBERS.map((functionNumber, functionIndex): MenuItem => ({
      label: `Funktion ${mainNumber}.${subNumber}.${functionNumber}`,
      styleClass: this.selectedFunctionIndex === functionIndex ? 'p-panelmenu-item-active' : undefined,
      linkClass: this.selectedFunctionIndex === functionIndex ? 'p-menuitem-link-active' : undefined,
      linkStyle:
        this.selectedFunctionIndex === functionIndex ? {backgroundColor: '#0055b9', color: '#ffffff'} : undefined,
      command: (): void => {
        this.selectedFunctionIndex = functionIndex;
      }
    }));
  }

  get applicationGroupColor(): string {
    return this.colors[this.selectedMainIndex];
  }

  get selectedFunctionLabel(): string {
    return `Funktion ${this.selectedMainIndex + 1}.${this.selectedSubIndex + 1}.${this.selectedFunctionIndex + 1}`;
  }

  get selectedUseCaseLabel(): string {
    return `Use Case ${this.selectedUseCase}`;
  }
}
