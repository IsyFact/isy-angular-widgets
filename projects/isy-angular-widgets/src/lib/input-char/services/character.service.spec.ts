import {TestBed} from '@angular/core/testing';

import {CharacterService} from './character.service';
import sonderzeichenliste from '../sonderzeichenliste.json';
import {Schriftzeichengruppe, Zeichenobjekt} from '../model/model';
import {Datentyp} from '../model/datentyp';

interface BaseInfo {
  name: string;
  count: number;
}

interface GroupInfo {
  name: string;
  count: number;
}

describe('CharacterService', () => {
  let service: CharacterService;
  const sonderZeichenliste = sonderzeichenliste as Zeichenobjekt[];
  const numberOfSonderZeichen = 908;
  const bases: BaseInfo [] = [
    {name: '*', count: 256},
    {name: 'A', count: 61},
    {name: 'B', count: 6},
    {name: 'C', count: 36},
    {name: 'D', count: 19},
    {name: 'E', count: 42},
    {name: 'F', count: 9},
    {name: 'G', count: 20},
    {name: 'H', count: 25},
    {name: 'I', count: 33},
    {name: 'J', count: 8},
    {name: 'K', count: 32},
    {name: 'L', count: 24},
    {name: 'M', count: 14},
    {name: 'N', count: 29},
    {name: 'O', count: 68},
    {name: 'P', count: 14},
    {name: 'Q', count: 2},
    {name: 'R', count: 23},
    {name: 'S', count: 29},
    {name: 'T', count: 31},
    {name: 'U', count: 56},
    {name: 'V', count: 2},
    {name: 'W', count: 12},
    {name: 'X', count: 4},
    {name: 'Y', count: 21},
    {name: 'Z', count: 32}
  ];
  const groups: GroupInfo[] = [
    {name: Schriftzeichengruppe.LATEIN, count: 649},
    {name: Schriftzeichengruppe.N1, count: 18},
    {name: Schriftzeichengruppe.N2, count: 60},
    {name: Schriftzeichengruppe.N3, count: 6},
    {name: Schriftzeichengruppe.N4, count: 1},
    {name: Schriftzeichengruppe.E1, count: 43},
    {name: Schriftzeichengruppe.GRIECHISCH, count: 69},
    {name: Schriftzeichengruppe.KYRILLISCH, count: 62}
  ];
  const schriftZeichenGruppen = Object.values(Schriftzeichengruppe);

  const DIN_91379_CHARS = ['ḗ', 'ē̍', 'ō̍', '̍', '′', '″'];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('check the sonderzeichenliste length', () => {
    expect(sonderZeichenliste.length).not.toBeUndefined();
    expect(sonderZeichenliste.length).not.toBeNull();
    expect(sonderZeichenliste.length).toEqual(numberOfSonderZeichen);
  });

  it('check the sonderzeichenliste to array conversion', () => {
    const schriftZeichenArray = service.getSchriftZeichenAsObjectArray();
    const numberOfGroups = Object.keys(Schriftzeichengruppe).length;
    expect(schriftZeichenArray.length).toEqual(numberOfGroups);
  });

  it('should check the filtering by base functionality for all different bases', () => {

    bases.forEach((base, index) => {
      const currentBase = bases[index];
      const zeichenObjekte = service.filterZeichenobjekteByBase(sonderZeichenliste, currentBase.name);
      expect(zeichenObjekte.length).toEqual(currentBase.count);
    });
  });

  it('should check the filtering by group functionality for all different groups', () => {
    groups.forEach((group, index) => {
      const currentGroup = groups[index];
      const zeichenObjekte = service.filterZeichenobjekteByGroup(sonderZeichenliste, currentGroup.name);
      expect(zeichenObjekte.length).toEqual(currentGroup.count);
    });
  });

  it('should check the zeichenobjekt to list conversion', () => {
    const baseList = service.getGrundZeichenAsList(sonderZeichenliste);
    for (let i = 0; i < baseList.length; i++) {
      expect(baseList[i]).toEqual(bases[i].name);
    }
  });

  it('should check the schriftzeichengruppe to schriftzeichen conversion', () => {
    const schriftzeichenGruppe = Schriftzeichengruppe.LATEIN;
    const schriftZeichen = service.convertSchriftZeichengruppeToSchriftzeichen(schriftzeichenGruppe);
    expect(schriftZeichen.id).toEqual(schriftzeichenGruppe);
    expect(schriftZeichen.gruppe).toEqual(schriftzeichenGruppe);
  });

  it('should check the schriftzeichengruppe array to schriftzeichen array conversion', () => {
    const schriftZeichen = service.convertToSchriftzeichenArray(schriftZeichenGruppen as Schriftzeichengruppe[]);
    for (let i = 0; i < schriftZeichenGruppen.length; i++) {
      expect(schriftZeichenGruppen[i]).toEqual(schriftZeichen[i].id);
      expect(schriftZeichenGruppen[i]).toEqual(schriftZeichen[i].gruppe);
    }
  });

  it('should check the group filtering by datatype = "DATENTYP_A"', () => {
    const dataType = Datentyp.DATENTYP_A;
    const filteredGroups = service.getGroupsByDataType(dataType);
    for (let i = 0; i < filteredGroups.length; i++) {
      expect(filteredGroups[i]).toEqual(schriftZeichenGruppen[i]);
    }
  });

  it('should check the group filtering by datatype = "DATENTYP_B"', () => {
    const dataType = Datentyp.DATENTYP_B;
    const filteredGroups = service.getGroupsByDataType(dataType);
    for (let i = 0; i < filteredGroups.length; i++) {
      expect(filteredGroups[i]).toEqual(schriftZeichenGruppen[i]);
    }
  });

  it('should check the group filtering by datatype = "DATENTYP_C"', () => {
    const dataType = Datentyp.DATENTYP_C;
    const filteredGroups = service.getGroupsByDataType(dataType);
    for (let i = 0; i < filteredGroups.length; i++) {
      expect(filteredGroups[i]).toEqual(schriftZeichenGruppen[i]);
    }
  });

  it('should check the group filtering by datatype = "DATENTYP_D"', () => {
    const dataType = Datentyp.DATENTYP_D;
    const filteredGroups = service.getGroupsByDataType(dataType);
    expect(filteredGroups[0]).toEqual(schriftZeichenGruppen[0]);
    expect(filteredGroups[1]).toEqual(schriftZeichenGruppen[1]);
    expect(filteredGroups[2]).toEqual(schriftZeichenGruppen[2]);
    expect(filteredGroups[3]).toEqual(schriftZeichenGruppen[3]);
    expect(filteredGroups[4]).toEqual(schriftZeichenGruppen[5]);
    expect(filteredGroups[5]).toEqual(schriftZeichenGruppen[6]);
  });

  it('should check the group filtering by datatype = "DATENTYP_E"', () => {
    const dataType = Datentyp.DATENTYP_E;
    const filteredGroups = service.getGroupsByDataType(dataType);
    expect(filteredGroups).toEqual(schriftZeichenGruppen);
  });

  it('new added DIN 91379 special characters are available', ()=> {
    DIN_91379_CHARS.forEach(character => {
      const filteredResult = sonderZeichenliste.filter(item => item.zeichen === character);
      expect(filteredResult[0].zeichen).toEqual(character);
    });
  });
});
