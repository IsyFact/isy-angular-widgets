import {TreeNode} from 'primeng/api';

export const organizationData: TreeNode[] = [
  {
    label: 'CEO',
    expanded: true,
    children: [
      {
        label: 'CMO',
        expanded: true,
        children: [
          {
            label: 'Sales'
          },
          {
            label: 'Marketing'
          }
        ]
      },
      {
        label: 'CTO',
        expanded: true,
        children: [
          {
            label: 'Development'
          },
          {
            label: 'UI/UX'
          }
        ]
      }
    ]
  }
];
