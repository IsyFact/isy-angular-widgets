import {Injectable} from '@angular/core';
import {Schriftzeichengruppe, Zeichenobjekt} from '../model/model';
import sonderzeichenliste from '../sonderzeichenliste.json';
import {Datentyp} from '../model/datentyp';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly characters = sonderzeichenliste as Zeichenobjekt[];

  private readonly charactersByDataTypeCache = new Map<Datentyp, Zeichenobjekt[]>();

  private readonly grundzeichenCache = new WeakMap<Zeichenobjekt[], string[]>();

  private readonly schriftzeichenGruppenCache = new WeakMap<Zeichenobjekt[], Schriftzeichengruppe[]>();

  getCharacters(): Zeichenobjekt[] {
    return this.characters;
  }

  getGrundzeichen(list: Zeichenobjekt[]): string[] {
    const cached = this.grundzeichenCache.get(list);

    if (cached) {
      return cached;
    }

    const res = [...new Set(list.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];

    // Put * to the first position if present
    const specialPos = res.indexOf('*');
    if (specialPos > 0) {
      res.splice(specialPos, 1);
      res.unshift('*');
    }

    this.grundzeichenCache.set(list, res);
    return res;
  }

  getSchriftzeichenGruppen(list: Zeichenobjekt[]): Schriftzeichengruppe[] {
    const cached = this.schriftzeichenGruppenCache.get(list);

    if (cached) {
      return cached;
    }

    const res: Schriftzeichengruppe[] = [];
    for (const char of list) {
      if (!res.includes(char.schriftzeichengruppe)) {
        res.push(char.schriftzeichengruppe);
      }
    }

    this.schriftzeichenGruppenCache.set(list, res);
    return res;
  }

  getCharactersByDataType(datentyp: Datentyp): Zeichenobjekt[] {
    const cached = this.charactersByDataTypeCache.get(datentyp);

    if (cached) {
      return cached;
    }

    const allowedGroups = this.getGroupsByDataType(datentyp);
    const res = this.getCharacters().filter((z) => allowedGroups.includes(z.schriftzeichengruppe));

    this.charactersByDataTypeCache.set(datentyp, res);
    return res;
  }

  getGroupsByDataType(dataTyp: Datentyp): Schriftzeichengruppe[] {
    switch (dataTyp) {
      case Datentyp.DATENTYP_A:
        return [Schriftzeichengruppe.LATEIN, Schriftzeichengruppe.N1];
      case Datentyp.DATENTYP_B:
        return [Schriftzeichengruppe.LATEIN, Schriftzeichengruppe.N1, Schriftzeichengruppe.N2];
      case Datentyp.DATENTYP_C:
        return [
          Schriftzeichengruppe.LATEIN,
          Schriftzeichengruppe.N1,
          Schriftzeichengruppe.N2,
          Schriftzeichengruppe.N3,
          Schriftzeichengruppe.N4
        ];
      case Datentyp.DATENTYP_D:
        return [
          Schriftzeichengruppe.LATEIN,
          Schriftzeichengruppe.N1,
          Schriftzeichengruppe.N2,
          Schriftzeichengruppe.N3,
          Schriftzeichengruppe.E1,
          Schriftzeichengruppe.GRIECHISCH
        ];
      default:
        return [
          Schriftzeichengruppe.LATEIN,
          Schriftzeichengruppe.N1,
          Schriftzeichengruppe.N2,
          Schriftzeichengruppe.N3,
          Schriftzeichengruppe.N4,
          Schriftzeichengruppe.E1,
          Schriftzeichengruppe.GRIECHISCH,
          Schriftzeichengruppe.KYRILLISCH
        ];
    }
  }

  filterByGrundzeichen(list: Zeichenobjekt[], grundzeichen?: string): Zeichenobjekt[] {
    return list.filter((z) => (z.grundzeichen === '' ? '*' : z.grundzeichen) === grundzeichen);
  }

  filterBySchriftzeichenGruppe(list: Zeichenobjekt[], schriftzeichenGruppe?: Schriftzeichengruppe): Zeichenobjekt[] {
    return list.filter((z) => z.schriftzeichengruppe === schriftzeichenGruppe);
  }
}
