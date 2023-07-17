import {Injectable} from '@angular/core';
import {SchriftZeichen, Schriftzeichengruppe, Zeichenobjekt} from '../model/model';
import sonderzeichenliste from '../sonderzeichenliste.json';
import {Datentyp} from '../model/datentyp';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  getCharacters(): Zeichenobjekt[] {
    return sonderzeichenliste as Zeichenobjekt[];
  }

  getSchriftZeichenAsObjectArray(): SchriftZeichen[] {
    return Object.entries(Schriftzeichengruppe).map(
      ([id, gruppe]) => ({id, gruppe})
    );
  }

  filterZeichenobjekteByBase(zeichen: Zeichenobjekt[], base: string): Zeichenobjekt[] {
    return zeichen.filter(z => z.grundzeichen === (base === '*' ? base = '' : base));
  }

  filterZeichenobjekteByGroup(zeichen: Zeichenobjekt[], group: string): Zeichenobjekt[] {
    return zeichen.filter(z => z.schriftzeichengruppe === group);
  }

  getGrundZeichenAsList(liste: Zeichenobjekt[]): string [] {
    return [...new Set(
      liste.map(item => item.grundzeichen === '' ? '*' : item.grundzeichen)
        .sort((a, b) => a.localeCompare(b)))
    ];
  }

  convertSchriftZeichengruppeToSchriftzeichen(schriftzeichengruppe: Schriftzeichengruppe): SchriftZeichen {
    const schriftzeichenGruppeName = Object.values(schriftzeichengruppe).join('');
    return {
      id: schriftzeichenGruppeName,
      gruppe: schriftzeichenGruppeName
    };
  }

  convertToSchriftzeichenArray(schriftzeichengruppen: Schriftzeichengruppe[]): SchriftZeichen[] {
    const x: SchriftZeichen[] = [];
    schriftzeichengruppen.forEach(item => {
      x.push(this.convertSchriftZeichengruppeToSchriftzeichen(item));
    });
    return x;
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

  filterSchriftzeichenGruppenBySchriftzeichen(schriftZeichenGruppen: SchriftZeichen[], datentyp: Datentyp): SchriftZeichen[] {
    const groupsToFilter = this.getGroupsByDataType(datentyp);
    const datentypSchriftzeichenGruppen = this.convertToSchriftzeichenArray(groupsToFilter);

    return schriftZeichenGruppen.filter(schriftzeichenGruppe => {
      return datentypSchriftzeichenGruppen.some(datentypSchriftzeichenGruppe => {
        return schriftzeichenGruppe.gruppe === datentypSchriftzeichenGruppe.gruppe;
      });
    });
  }
}
