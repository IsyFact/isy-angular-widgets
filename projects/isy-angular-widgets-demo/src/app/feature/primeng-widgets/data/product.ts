import {DeliveryStatus, ItSolution, Product, StorageStatus} from '../model/product';
import {MegaMenuItem, MenuItem} from 'primeng/api';

export const productData: Product[] = [
  {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
  {
    id: '1001',
    code: 'nvklal433',
    name: 'Black Watch',
    price: 72,
    category: 'Accessories',
    quantity: 61,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 4
  },
  {
    id: '1002',
    code: 'zz21cz3c1',
    name: 'Blue Band',
    price: 79,
    category: 'Fitness',
    quantity: 2,
    inventoryStatus: 'LOWSTOCK',
    rating: 3
  },
  {
    id: '1003',
    code: '244wgerg2',
    name: 'Blue T-Shirt',
    price: 29,
    category: 'Clothing',
    quantity: 25,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
  {
    id: '1004',
    code: 'h456wer53',
    name: 'Bracelet',
    price: 15,
    category: 'Accessories',
    quantity: 73,
    inventoryStatus: 'INSTOCK',
    rating: 4
  },
  {
    id: '1005',
    code: 'av2231fwg',
    name: 'Brown Purse',
    price: 120,
    category: 'Accessories',
    quantity: 0,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 4
  },
  {
    id: '1006',
    code: 'bib36pfvm',
    name: 'Chakra Bracelet',
    price: 32,
    category: 'Accessories',
    quantity: 5,
    inventoryStatus: 'LOWSTOCK',
    rating: 3
  },
  {
    id: '1007',
    code: 'mbvjkgip5',
    name: 'Galaxy Earrings',
    price: 34,
    category: 'Accessories',
    quantity: 23,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
  {
    id: '1008',
    code: 'vbb124btr',
    name: 'Game Controller',
    price: 99,
    category: 'Electronics',
    quantity: 2,
    inventoryStatus: 'LOWSTOCK',
    rating: 4
  },
  {
    id: '1009',
    code: 'cm230f032',
    name: 'Gaming Set',
    price: 299,
    category: 'Electronics',
    quantity: 64,
    inventoryStatus: 'INSTOCK',
    rating: 3
  },
  {
    id: '1010',
    code: 'plb34234v',
    name: 'Gold Phone Case',
    price: 24,
    category: 'Accessories',
    quantity: 0,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 4
  },
  {
    id: '1011',
    code: '4920nnc2d',
    name: 'Green Earbuds',
    price: 89,
    category: 'Electronics',
    quantity: 23,
    inventoryStatus: 'INSTOCK',
    rating: 4
  },
  {
    id: '1012',
    code: '250vm23cc',
    name: 'Green T-Shirt',
    price: 49,
    category: 'Clothing',
    quantity: 74,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
  {
    id: '1013',
    code: 'fldsmn31b',
    name: 'Grey T-Shirt',
    price: 48,
    category: 'Clothing',
    quantity: 0,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 3
  }
];

export const deliveryData: DeliveryStatus[] = [
  {status: 'Ordered', date: '15/10/2020 10:30'},
  {status: 'Processing', date: '15/10/2020 14:00'},
  {status: 'Shipped', date: '15/10/2020 16:15'},
  {status: 'Delivered', date: '16/10/2020 10:00'}
];

export const itSolutionData: ItSolution[] = [
  {
    key: '0',
    data: {
      name: 'Applications',
      size: '100kb',
      type: 'Folder'
    },
    children: [
      {
        key: '0-0',
        data: {
          name: 'React',
          size: '25kb',
          type: 'Folder'
        },
        children: [
          {
            key: '0-0-0',
            data: {
              name: 'react.app',
              size: '10kb',
              type: 'Application'
            }
          },
          {
            key: '0-0-1',
            data: {
              name: 'native.app',
              size: '10kb',
              type: 'Application'
            }
          },
          {
            key: '0-0-2',
            data: {
              name: 'mobile.app',
              size: '5kb',
              type: 'Application'
            }
          }
        ]
      },
      {
        key: '0-1',
        data: {
          name: 'editor.app',
          size: '25kb',
          type: 'Application'
        }
      },
      {
        key: '0-2',
        data: {
          name: 'settings.app',
          size: '50kb',
          type: 'Application'
        }
      }
    ]
  },
  {
    key: '1',
    data: {
      name: 'Cloud',
      size: '20kb',
      type: 'Folder'
    },
    children: [
      {
        key: '1-0',
        data: {
          name: 'backup-1.zip',
          size: '10kb',
          type: 'Zip'
        }
      },
      {
        key: '1-1',
        data: {
          name: 'backup-2.zip',
          size: '10kb',
          type: 'Zip'
        }
      }
    ]
  },
  {
    key: '2',
    data: {
      name: 'Desktop',
      size: '150kb',
      type: 'Folder'
    },
    children: [
      {
        key: '2-0',
        data: {
          name: 'note-meeting.txt',
          size: '50kb',
          type: 'Text'
        }
      },
      {
        key: '2-1',
        data: {
          name: 'note-todo.txt',
          size: '100kb',
          type: 'Text'
        }
      }
    ]
  },
  {
    key: '3',
    data: {
      name: 'Documents',
      size: '75kb',
      type: 'Folder'
    },
    children: [
      {
        key: '3-0',
        data: {
          name: 'Work',
          size: '55kb',
          type: 'Folder'
        },
        children: [
          {
            key: '3-0-0',
            data: {
              name: 'Expenses.doc',
              size: '30kb',
              type: 'Document'
            }
          },
          {
            key: '3-0-1',
            data: {
              name: 'Resume.doc',
              size: '25kb',
              type: 'Resume'
            }
          }
        ]
      },
      {
        key: '3-1',
        data: {
          name: 'Home',
          size: '20kb',
          type: 'Folder'
        },
        children: [
          {
            key: '3-1-0',
            data: {
              name: 'Invoices',
              size: '20kb',
              type: 'Text'
            }
          }
        ]
      }
    ]
  },
  {
    key: '4',
    data: {
      name: 'Downloads',
      size: '25kb',
      type: 'Folder'
    },
    children: [
      {
        key: '4-0',
        data: {
          name: 'Spanish',
          size: '10kb',
          type: 'Folder'
        },
        children: [
          {
            key: '4-0-0',
            data: {
              name: 'tutorial-a1.txt',
              size: '5kb',
              type: 'Text'
            }
          },
          {
            key: '4-0-1',
            data: {
              name: 'tutorial-a2.txt',
              size: '5kb',
              type: 'Text'
            }
          }
        ]
      },
      {
        key: '4-1',
        data: {
          name: 'Travel',
          size: '15kb',
          type: 'Text'
        },
        children: [
          {
            key: '4-1-0',
            data: {
              name: 'Hotel.pdf',
              size: '10kb',
              type: 'PDF'
            }
          },
          {
            key: '4-1-1',
            data: {
              name: 'Flight.pdf',
              size: '5kb',
              type: 'PDF'
            }
          }
        ]
      }
    ]
  },
  {
    key: '5',
    data: {
      name: 'Main',
      size: '50kb',
      type: 'Folder'
    },
    children: [
      {
        key: '5-0',
        data: {
          name: 'bin',
          size: '50kb',
          type: 'Link'
        }
      },
      {
        key: '5-1',
        data: {
          name: 'etc',
          size: '100kb',
          type: 'Link'
        }
      },
      {
        key: '5-2',
        data: {
          name: 'var',
          size: '100kb',
          type: 'Link'
        }
      }
    ]
  },
  {
    key: '6',
    data: {
      name: 'Other',
      size: '5kb',
      type: 'Folder'
    },
    children: [
      {
        key: '6-0',
        data: {
          name: 'todo.txt',
          size: '3kb',
          type: 'Text'
        }
      },
      {
        key: '6-1',
        data: {
          name: 'logo.png',
          size: '2kb',
          type: 'Picture'
        }
      }
    ]
  },
  {
    key: '7',
    data: {
      name: 'Pictures',
      size: '150kb',
      type: 'Folder'
    },
    children: [
      {
        key: '7-0',
        data: {
          name: 'barcelona.jpg',
          size: '90kb',
          type: 'Picture'
        }
      },
      {
        key: '7-1',
        data: {
          name: 'primeng.png',
          size: '30kb',
          type: 'Picture'
        }
      },
      {
        key: '7-2',
        data: {
          name: 'prime.jpg',
          size: '30kb',
          type: 'Picture'
        }
      }
    ]
  },
  {
    key: '8',
    data: {
      name: 'Videos',
      size: '1500kb',
      type: 'Folder'
    },
    children: [
      {
        key: '8-0',
        data: {
          name: 'primefaces.mkv',
          size: '1000kb',
          type: 'Video'
        }
      },
      {
        key: '8-1',
        data: {
          name: 'intro.avi',
          size: '500kb',
          type: 'Video'
        }
      }
    ]
  }
];

export const electronicData: MenuItem[] = [
  {label: 'Electronics'},
  {label: 'Computer'},
  {label: 'Accessories'},
  {label: 'Keyboard'},
  {label: 'Wireless'}
];

export const megaMenuProductData: MegaMenuItem[] = [
  {
    label: 'Furniture',
    icon: 'pi pi-box',
    items: [
      [
        {
          label: 'Living Room',
          items: [
            {label: 'Accessories'},
            {label: 'Armchair'},
            {label: 'Coffee Table'},
            {label: 'Couch'},
            {label: 'TV Stand'}
          ]
        }
      ],
      [
        {
          label: 'Kitchen',
          items: [{label: 'Bar stool'}, {label: 'Chair'}, {label: 'Table'}]
        },
        {
          label: 'Bathroom',
          items: [{label: 'Accessories'}]
        }
      ],
      [
        {
          label: 'Bedroom',
          items: [
            {label: 'Bed'},
            {label: 'Chaise lounge'},
            {label: 'Cupboard'},
            {label: 'Dresser'},
            {label: 'Wardrobe'}
          ]
        }
      ],
      [
        {
          label: 'Office',
          items: [
            {label: 'Bookcase'},
            {label: 'Cabinet'},
            {label: 'Chair'},
            {label: 'Desk'},
            {label: 'Executive Chair'}
          ]
        }
      ]
    ]
  },
  {
    label: 'Electronics',
    icon: 'pi pi-mobile',
    items: [
      [
        {
          label: 'Computer',
          items: [
            {label: 'Monitor'},
            {label: 'Mouse'},
            {label: 'Notebook'},
            {label: 'Keyboard'},
            {label: 'Printer'},
            {label: 'Storage'}
          ]
        }
      ],
      [
        {
          label: 'Home Theather',
          items: [{label: 'Projector'}, {label: 'Speakers'}, {label: 'TVs'}]
        }
      ],
      [
        {
          label: 'Gaming',
          items: [{label: 'Accessories'}, {label: 'Console'}, {label: 'PC'}, {label: 'Video Games'}]
        }
      ]
    ]
  },
  {
    label: 'Sports',
    icon: 'pi pi-clock',
    items: [
      [
        {
          label: 'Football',
          items: [{label: 'Kits'}, {label: 'Shoes'}, {label: 'Shorts'}, {label: 'Training'}]
        }
      ],
      [
        {
          label: 'Running',
          items: [{label: 'Accessories'}, {label: 'Shoes'}, {label: 'T-Shirts'}, {label: 'Shorts'}]
        }
      ],
      [
        {
          label: 'Swimming',
          items: [{label: 'Kickboard'}, {label: 'Nose Clip'}, {label: 'Swimsuits'}, {label: 'Paddles'}]
        }
      ]
    ]
  }
];

export const storageData: StorageStatus[] = [
  {label: 'Apps', color: '#008272', value: 16},
  {label: 'Messages', color: '#ffb900', value: 8},
  {label: 'Media', color: '$themePrimary', value: 24},
  {label: 'System', color: '#e3008c', value: 10}
];
