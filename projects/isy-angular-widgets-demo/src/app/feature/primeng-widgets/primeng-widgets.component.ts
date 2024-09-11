import {Component} from '@angular/core';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {Country} from './model/country';
import {countryCityMapping, countryData} from './data/country';
import {FileOption} from './model/file-option';
import {
  contextMenuData,
  fileOptionData,
  menuBarData,
  optionData,
  fileContainerData,
  tabMenuData,
  messageData
} from './data/file-option';
import {ConfirmationService, MegaMenuItem, MenuItem, Message, MessageService, TreeNode} from 'primeng/api';
import {organizationData, personalData} from './data/organization';
import {DeliveryStatus, ItSolution, Product, StorageStatus} from './model/product';
import {
  deliveryData,
  electronicData,
  itSolutionData,
  megaMenuProductData,
  productData,
  storageData
} from './data/product';
import {UploadEvent} from 'primeng/fileupload';

@Component({
  selector: 'demo-primeng-widgets',
  templateUrl: './primeng-widgets.component.html',
  styleUrl: './primeng-widgets.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class PrimengWidgetsComponent {
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  countries: Country[] = countryData;
  filteredCountries: Country[] = [];

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  cities: any[] = countryCityMapping;

  stateOptions: string[] = ['Off', 'On'];
  files: FileOption[] = fileOptionData;
  option: MenuItem[] = optionData;
  contextMenuOption: MenuItem[] = contextMenuData;
  menuBarOption: MenuItem[] = menuBarData;
  fileContainerOptions: MenuItem[] = fileContainerData;
  tabMenuOption: MenuItem[] = tabMenuData;
  messages: Message[] = messageData;

  organization: TreeNode[] = organizationData;
  stepItem: MenuItem[] = personalData;

  products: Product[] = productData;
  selectedProduct: Product = {};
  deliveryStatus: DeliveryStatus[] = deliveryData;
  itSolutions: ItSolution[] = itSolutionData;
  electronics: MenuItem[] = electronicData;
  storageStatus: StorageStatus[] = storageData;
  megaMenuOptions: MegaMenuItem[] = megaMenuProductData;

  visibleDialog: boolean = false;
  visibleSidebar: boolean = false;
  blockedContent: boolean = false;

  filterCountry(event: AutoCompleteCompleteEvent): void {
    const filtered: Country[] = [];
    const query = event.query;

    for (const country of this.countries) {
      if (country.name.toLowerCase().startsWith(query.toLowerCase())) {
        filtered.push(country);
      }
    }

    this.filteredCountries = filtered;
  }

  confirmDialog(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      key: 'confirmDialog',
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.messageService.add({severity: 'success', summary: 'Confirmed', detail: 'You have accepted'});
      },
      reject: () => {
        this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
      }
    });
  }

  confirmPopup(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      key: 'confirmPopup',
      message: 'Are you sure you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({severity: 'info', summary: 'Confirmed', detail: 'You have accepted'});
      },
      reject: () => {
        this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
      }
    });
  }

  showDialog(): void {
    this.visibleDialog = true;
  }

  closeDialog(): void {
    this.visibleDialog = false;
  }

  showSidebar(): void {
    this.visibleSidebar = true;
  }

  showToastMessage(): void {
    this.messageService.add({key: 'toast', severity: 'success', summary: 'Success', detail: 'Message Content'});
  }

  onUpload(event: UploadEvent): void {
    this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode'});
  }

  blockContent(): void {
    this.blockedContent = true;
  }

  unblockContent(): void {
    this.blockedContent = false;
  }
}
