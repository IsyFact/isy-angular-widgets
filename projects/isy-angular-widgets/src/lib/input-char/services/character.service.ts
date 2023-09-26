import {Injectable} from '@angular/core';
import {Schriftzeichengruppe, Zeichenobjekt} from '../model/model';
import sonderzeichenliste from '../sonderzeichenliste.json';
import {Datentyp} from '../model/datentyp';

/**
 * @internal
 */
@Injectable()
export class CharacterService {

  getCharacters(): Zeichenobjekt[] {
    return sonderzeichenliste as Zeichenobjekt[];
  }
  getCharactersByDataType(datentyp: Datentyp): Zeichenobjekt[] {
    const allowedGroups = this.getGroupsByDataType(datentyp);
    return this.getCharacters().filter(z => allowedGroups.includes(z.schriftzeichengruppe));
  }
  getGroupsByDataType(dataTyp: Datentyp): Schriftzeichengruppe[] {
    switch (dataTyp) {
      case Datentyp.DATENTYP_A:
        return [
          Schriftzeichengruppe.LATEIN,
          Schriftzeichengruppe.N1
        ];
      case Datentyp.DATENTYP_B:
        return [
          Schriftzeichengruppe.LATEIN,
          Schriftzeichengruppe.N1,
          Schriftzeichengruppe.N2
        ];
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
}
