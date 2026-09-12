// Station 1 — הטבלאות המשקרות. Source: תחנה_1_שמונה_טבלאות.xlsx.
//
// FIVE tables, one number each: how many unique convoys actually crossed.
// Per-table answers 5, 6, 4, 8, 7 — sum 30, digital root 3.
//
// The source has eight and Hadas cut it to five on 2026-09-12, after her
// team lead flagged the station as too long. Nothing was lost: the eight are
// not eight kinds of dirt, they are the same three rules — status wording,
// duplicate identifiers, missing values — run eight times over different
// data. Tables 6 to 8 taught nothing 1 to 5 had not already taught, and the
// cut takes a group from 128 rows to 80 inside the same seven minutes.
//
// The digit survives the cut honestly: 5+6+4+8+7 = 30, and 3+0 = 3, which is
// the digit the eight tables gave. So the digital root is still the group's
// own arithmetic rather than a number we award.
//
// The rule the answer key uses that the source instructions never state:
// a row with a missing value is unusable and is not counted, EVEN when its
// status says it crossed. Without it table 1 gives 7, not 5. It is stated
// on screen for that reason.
//
// The mixed ton/kg units are a distractor by design and are never explained;
// they survive only as the last of the four hints.

export const COLUMNS = ['מזהה', 'תאריך', 'מעבר', 'משקל', 'יחידה', 'סטטוס'];

const KG = 'ק"ג';
const TON = 'טון';
const JUNK = ['— שורת זבל —', '', '', '', '', ''];

const G = "ג'נתא";
const Q = 'קוסייא';
const A = 'אסאל אל-וורד';

// row = [id, date, crossing, weight, unit, status]
const T = (rows, count) => ({ rows, count });

export const TABLES = [
  T([['S-06', '12/01/2026', A, '15000', KG, 'בוטל'],
     ['S-10', '20/01/2026', G, '', '', 'חצה'],
     ['S-03', '2026-01-06', G, '22500', KG, 'חצה'],
     ['S-02', '2026-01-04', A, '23', TON, 'CROSSED'],
     ['S-11', '22/01/2026', Q, '', '', 'הושלם'],
     ['S-09', '18/01/2026', A, '17', TON, 'ממתין'],
     ['S-01', '2026-01-02', Q, '22', TON, 'הושלם'],
     ['S-03', '06/01/2026', G, '22500', KG, 'חצה'],
     ['S-07', '14/01/2026', G, '15', TON, 'כשל'],
     ['S-04', '08/01/2026', Q, '25', TON, 'הושלם'],
     ['S-05', '10/01/2026', A, '26', TON, 'CROSSED'],
     ['S-01', '02/01/2026', Q, '22', TON, 'הושלם'],
     ['S-02', '04/01/2026', A, '23', TON, 'CROSSED'],
     ['S-08', '16/01/2026', Q, '17000', KG, 'נכשל'],
     JUNK], 5),

  T([['T-03', '06/02/2026', G, '22500', KG, 'חצה'],
     ['T-10', '20/02/2026', G, '17', TON, 'ממתין'],
     ['T-07', '14/02/2026', G, '15000', KG, 'בוטל'],
     ['T-02', '2026-02-04', A, '23', TON, 'CROSSED'],
     ['T-05', '10/02/2026', A, '26', TON, 'CROSSED'],
     ['T-01', '2026-02-02', Q, '22', TON, 'הושלם'],
     ['T-06', '12/02/2026', G, '24000', KG, 'חצה'],
     ['T-08', '16/02/2026', Q, '15', TON, 'כשל'],
     ['T-11', '22/02/2026', Q, '', '', 'חצה'],
     ['T-03', '2026-02-06', G, '22500', KG, 'חצה'],
     ['T-09', '18/02/2026', A, '17000', KG, 'נכשל'],
     ['T-04', '08/02/2026', Q, '25', TON, 'הושלם'],
     ['T-02', '04/02/2026', A, '23', TON, 'CROSSED'],
     ['T-12', '24/02/2026', A, '', '', 'הושלם'],
     ['T-01', '02/02/2026', Q, '22', TON, 'הושלם'],
     JUNK], 6),

  T([['U-09', '18/03/2026', A, '', '', 'חצה'],
     ['U-04', '08/03/2026', Q, '25', TON, 'הושלם'],
     ['U-08', '16/03/2026', Q, '17', TON, 'ממתין'],
     ['U-06', '12/03/2026', A, '15', TON, 'כשל'],
     ['U-05', '10/03/2026', Q, '15000', KG, 'בוטל'],
     ['U-02', '04/03/2026', A, '23', TON, 'CROSSED'],
     ['U-10', '20/03/2026', G, '', '', 'הושלם'],
     ['U-02', '2026-03-04', A, '23', TON, 'CROSSED'],
     ['U-03', '2026-03-06', G, '22500', KG, 'חצה'],
     ['U-03', '06/03/2026', G, '22500', KG, 'חצה'],
     ['U-01', '02/03/2026', Q, '22', TON, 'הושלם'],
     ['U-01', '2026-03-02', Q, '22', TON, 'הושלם'],
     ['U-07', '14/03/2026', G, '17000', KG, 'נכשל'],
     JUNK], 4),

  T([['V-14', '28/04/2026', Q, '', '', 'הושלם'],
     ['V-01', '2026-04-02', Q, '22', TON, 'הושלם'],
     ['V-07', '14/04/2026', Q, '28', TON, 'הושלם'],
     ['V-03', '06/04/2026', G, '22500', KG, 'חצה'],
     ['V-03', '2026-04-06', G, '22500', KG, 'חצה'],
     ['V-09', '18/04/2026', A, '15000', KG, 'בוטל'],
     ['V-13', '26/04/2026', G, '', '', 'חצה'],
     ['V-02', '04/04/2026', A, '23', TON, 'CROSSED'],
     ['V-08', '16/04/2026', A, '29', TON, 'CROSSED'],
     ['V-01', '02/04/2026', Q, '22', TON, 'הושלם'],
     ['V-05', '10/04/2026', A, '26', TON, 'CROSSED'],
     ['V-02', '2026-04-04', A, '23', TON, 'CROSSED'],
     ['V-12', '24/04/2026', A, '17', TON, 'ממתין'],
     ['V-11', '22/04/2026', Q, '17000', KG, 'נכשל'],
     ['V-06', '12/04/2026', G, '24000', KG, 'חצה'],
     ['V-04', '08/04/2026', Q, '25', TON, 'הושלם'],
     ['V-10', '20/04/2026', G, '15', TON, 'כשל'],
     JUNK], 8),

  T([['W-06', '12/05/2026', G, '24000', KG, 'חצה'],
     ['W-03', '2026-05-06', G, '22500', KG, 'חצה'],
     ['W-02', '2026-05-04', A, '23', TON, 'CROSSED'],
     ['W-03', '06/05/2026', G, '22500', KG, 'חצה'],
     ['W-01', '2026-05-02', Q, '22', TON, 'הושלם'],
     ['W-10', '20/05/2026', G, '17000', KG, 'נכשל'],
     ['W-13', '26/05/2026', G, '', '', 'הושלם'],
     ['W-12', '24/05/2026', A, '', '', 'חצה'],
     ['W-11', '22/05/2026', Q, '17', TON, 'ממתין'],
     ['W-05', '10/05/2026', A, '26', TON, 'CROSSED'],
     ['W-04', '08/05/2026', Q, '25', TON, 'הושלם'],
     ['W-08', '16/05/2026', Q, '15000', KG, 'בוטל'],
     ['W-01', '02/05/2026', Q, '22', TON, 'הושלם'],
     ['W-02', '04/05/2026', A, '23', TON, 'CROSSED'],
     ['W-09', '18/05/2026', A, '15', TON, 'כשל'],
     ['W-07', '14/05/2026', Q, '28', TON, 'הושלם'],
     JUNK], 7),

];

export const isJunkRow = row => row[0].startsWith('—');
export const isMissing = row => row[3] === '' && !isJunkRow(row);
