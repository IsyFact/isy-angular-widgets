import {TestBed} from '@angular/core/testing';

import {CharacterService} from './character.service';
import {Schriftzeichengruppe} from '../model/model';
import {Datentyp} from '../model/datentyp';

describe('CharacterService', () => {
  let service: CharacterService;


  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    service = TestBed.inject(CharacterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const numberOfSonderZeichen = 908;
  it(`should return ${numberOfSonderZeichen} characters`, () => {
    expect(service.getCharacters().length).toEqual(numberOfSonderZeichen);
  });

  const groupCounts = new Map<Schriftzeichengruppe, number>([
    [Schriftzeichengruppe.LATEIN, 649],
    [Schriftzeichengruppe.N1, 18],
    [Schriftzeichengruppe.N2, 60],
    [Schriftzeichengruppe.N3, 6],
    [Schriftzeichengruppe.N4, 1],
    [Schriftzeichengruppe.E1, 43],
    [Schriftzeichengruppe.GRIECHISCH, 69],
    [Schriftzeichengruppe.KYRILLISCH, 62]
  ]);
  groupCounts.forEach((expectedCount, schriftzeichengruppe) => {
    it(`should return ${expectedCount} characters with Schriftzeichengruppe ${schriftzeichengruppe}`, () => {
      expect(service.getCharacters().filter(character => character.schriftzeichengruppe === schriftzeichengruppe).length).toEqual(expectedCount);
    });
  });

  const baseCounts = new Map<string, number>([
    ['', 256],
    ['A', 61],
    ['B', 6],
    ['C', 36],
    ['D', 19],
    ['E', 42],
    ['F', 9],
    ['G', 20],
    ['H', 25],
    ['I', 33],
    ['J', 8],
    ['K', 32],
    ['L', 24],
    ['M', 14],
    ['N', 29],
    ['O', 68],
    ['P', 14],
    ['Q', 2],
    ['R', 23],
    ['S', 29],
    ['T', 31],
    ['U', 56],
    ['V', 2],
    ['W', 12],
    ['X', 4],
    ['Y', 21],
    ['Z', 32]
  ]);
  baseCounts.forEach((expectedCount, base) => {
    it(`should return ${expectedCount} characters with Grundzeichen ${base}`, () => {
      expect(service.getCharacters().filter(character => character.grundzeichen === base).length).toEqual(expectedCount);
    });
  });

  const datenTypTestDataSet = [
    {
      datentyp: Datentyp.DATENTYP_A,
      characters: 667,
      expectedSchriftzeichengruppen: [
        Schriftzeichengruppe.LATEIN,
        Schriftzeichengruppe.N1
      ]
    },    {
      datentyp: Datentyp.DATENTYP_B,
      characters: 727,
      expectedSchriftzeichengruppen: [
        Schriftzeichengruppe.LATEIN,
        Schriftzeichengruppe.N1,
        Schriftzeichengruppe.N2
      ]
    },    {
      datentyp: Datentyp.DATENTYP_C,
      characters: 734,
      expectedSchriftzeichengruppen: [
        Schriftzeichengruppe.LATEIN,
        Schriftzeichengruppe.N1,
        Schriftzeichengruppe.N2,
        Schriftzeichengruppe.N3,
        Schriftzeichengruppe.N4
      ]
    },    {
      datentyp: Datentyp.DATENTYP_D,
      characters: 845,
      expectedSchriftzeichengruppen: [
        Schriftzeichengruppe.LATEIN,
        Schriftzeichengruppe.N1,
        Schriftzeichengruppe.N2,
        Schriftzeichengruppe.N3,
        Schriftzeichengruppe.E1,
        Schriftzeichengruppe.GRIECHISCH
      ]
    },    {
      datentyp: Datentyp.DATENTYP_E,
      characters: 908,
      expectedSchriftzeichengruppen: [
        Schriftzeichengruppe.LATEIN,
        Schriftzeichengruppe.N1,
        Schriftzeichengruppe.N2,
        Schriftzeichengruppe.N3,
        Schriftzeichengruppe.N4,
        Schriftzeichengruppe.E1,
        Schriftzeichengruppe.GRIECHISCH,
        Schriftzeichengruppe.KYRILLISCH
      ]
    }
  ];
  datenTypTestDataSet.forEach(testData =>  {
    describe(`with ${testData.datentyp}`, () => {
      const datentyp = testData.datentyp;
      const numberOfSchriftzeichenGruppen = testData.expectedSchriftzeichengruppen.length;
      const numberOfCharacters = testData.characters;

      it(`should return ${numberOfSchriftzeichenGruppen} Schriftzeichengruppen`, () => {
        expect(service.getGroupsByDataType(datentyp).length).toEqual(numberOfSchriftzeichenGruppen);
      });

      it(`should return ${numberOfCharacters} characters`, () => {
        expect(service.getCharactersByDataType(datentyp).length).toEqual(numberOfCharacters);
      });

      testData.expectedSchriftzeichengruppen.forEach(expectedSchriftzeichengruppe => {
        it(`should contain ${expectedSchriftzeichengruppe}`, () => {
          for (const expectedSchriftzeichengruppe of testData.expectedSchriftzeichengruppen) {
            expect(service.getGroupsByDataType(datentyp)).toContain(expectedSchriftzeichengruppe);
          }
        });
      });

      it('should not contain unexpected Schriftzeichengruppen', () => {
        const schriftzeichengruppen = service.getGroupsByDataType(datentyp);
        for (const schriftzeichengruppe of schriftzeichengruppen) {
          expect(testData.expectedSchriftzeichengruppen).toContain(schriftzeichengruppe);
        }
      });
    });
  });

  const DIN_91379_CHARS = ['ḗ', 'ē̍', 'ō̍', '̍', '′', '″'];
  DIN_91379_CHARS.forEach(character => {
    it(`should contain DIN 91379 special character ${character}`, ()=> {
      const filteredResult = service.getCharacters().find(item => item.zeichen === character);
      expect(filteredResult).toBeTruthy();
    });
  });
});
