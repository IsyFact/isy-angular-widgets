import {Component} from '@angular/core';
import {TreeNode} from 'primeng/api';

import {organizationData} from '../../data/organization';
import {countryData} from '../../data/country';
import {Country} from '../../model/country';
import {deliveryData, itSolutionData, productData} from '../../data/product';
import {DeliveryStatus, ItSolution, Product} from '../../model/product';
import {fileOptionData} from '../../data/file-option';
import {FileOption} from '../../model/file-option';

@Component({
  selector: 'demo-primeng-data',
  templateUrl: './primeng-data.component.html',
  styleUrl: './primeng-data.component.scss'
})
export class PrimengDataComponent {
  organization: TreeNode[] = organizationData;
  countries: Country[] = countryData;
  products: Product[] = productData;
  selectedProduct: Product = {};
  deliveryStatus: DeliveryStatus[] = deliveryData;
  files: FileOption[] = fileOptionData;
  itSolutions: ItSolution[] = itSolutionData;
}
