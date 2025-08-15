import {inject, Injectable} from '@angular/core';
import {MegaMenuItem, MenuItem} from 'primeng/api';
import {firstValueFrom} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

/**
 * A service to translate labels and titles of {@link MenuItem} or {@link MegaMenuItem} using the ngx-translation service.
 * Instead of label or title descriptions, the i18n key has to be provided in the label or title field of a menu item.
 * @example
 * const items = [
 *   {
 *      label: 'my-lib.menu.label',
 *      items: [
 *        {
 *          label: 'my-lib.menu.other-label',
 *          title: 'my-lib.menu.title'
 *        }
 *      ]
 *   }
 * ];
 *
 * const translatedItems = await service.translateMenuItems(items)
 */
@Injectable({
  providedIn: 'root'
})
export class MenuTranslationService {
  private readonly translate = inject(TranslateService);

  /**
   * Translates all `label` and `title` fields of  {@link MenuItem} and all submenu items.
   * @param items Menu items to translate
   * @returns translated {@link MegaMenuItem}
   */
  async translateMenuItems(items: MenuItem[]): Promise<MenuItem[]> {
    const translatedItems = [];

    for (const untranslatedItem of items) {
      const translatedItem = {...untranslatedItem};

      translatedItem.label = (await firstValueFrom(this.translate.get(untranslatedItem.label as string))) as string;

      if (translatedItem.title) {
        translatedItem.title = (await firstValueFrom(this.translate.get(untranslatedItem.title as string))) as string;
      }

      if (translatedItem.items) {
        translatedItem.items = await this.translateMenuItems(translatedItem.items);
      }

      translatedItems.push(translatedItem);
    }

    return translatedItems;
  }

  /**
   * Translates all `label` and `title` fields of  {@link MegaMenuItem} and all submenu items.
   * @param items MegaMenu items to translate
   * @returns translated {@link MegaMenuItem}
   */
  async translateMegaMenuItems(items: MegaMenuItem[]): Promise<MegaMenuItem[]> {
    const translatedItems = [];

    for (const untranslatedItem of items) {
      const translatedItem = {...untranslatedItem};

      translatedItem.label = (await firstValueFrom(this.translate.get(untranslatedItem.label as string))) as string;
      if (translatedItem.title) {
        translatedItem.title = (await firstValueFrom(this.translate.get(untranslatedItem.title as string))) as string;
      }

      if (translatedItem.items) {
        const translatedSubItems = [];

        for (const item of translatedItem.items) {
          translatedSubItems.push(await this.translateMenuItems(item));
        }
        translatedItem.items = translatedSubItems;
      }

      translatedItems.push(translatedItem);
    }

    return translatedItems;
  }
}
