// Station 5 — מי קיבל תשובות ומי לא. Source: תחנה_5_.docx.
//
// TWO ROUNDS. Round one is the source's: ten trucks we have intelligence
// on, six we do not, and exactly one feature explains every label — an
// antenna on the roof. Round two is ours, added 2026-09-16, and its rule
// takes two features at once. Round one still gives the digit.
//
// Of the six, U-01 and U-03 carry, so the digit is 2. That matches the
// roster and the lock code.
//
// The build spec records that the draft carries a DIFFERENT card set for
// this station. `תחנה_5_.docx` is the authoritative one and is what is
// transcribed here; both sets happen to yield 2.
//
// The other three features are deliberate noise: colour, wheels and box
// each appear on both sides of the labelled split, so none of them can be
// the rule. Verified in the station-5 data test.

export const FEATURES = [
  { key: 'colour',  label: 'צבע' },
  { key: 'antenna', label: 'אנטנה' },
  { key: 'wheels',  label: 'גלגלים' },
  { key: 'box',     label: 'ארגז' }
];

const card = (id, colour, antenna, wheels, box) => ({ id, colour, antenna, wheels, box });

// The ten we know about. `carries` is ground truth, shown to the group.
const known = (c, carries) => ({ ...c, carries });

export const LABELLED = [
  known(card('M-01', 'לבן', 'יש', '6', 'פתוח'), true),
  known(card('M-02', 'חול', 'יש', '8', 'סגור'), true),
  known(card('M-03', 'לבן', 'יש', '6', 'סגור'), true),
  known(card('M-04', 'חול', 'יש', '8', 'פתוח'), true),
  known(card('M-05', 'לבן', 'יש', '8', 'סגור'), true),
  known(card('M-06', 'חול', 'אין', '6', 'פתוח'), false),
  known(card('M-07', 'לבן', 'אין', '8', 'פתוח'), false),
  known(card('M-08', 'חול', 'אין', '6', 'סגור'), false),
  known(card('M-09', 'לבן', 'אין', '8', 'סגור'), false),
  known(card('M-10', 'חול', 'אין', '6', 'פתוח'), false)
];

// The six with no label. `carries` here is the answer key and is never
// rendered — it only ever reaches the answer engine.
export const UNLABELLED = [
  known(card('U-01', 'לבן', 'יש', '6', 'פתוח'), true),
  known(card('U-02', 'חול', 'אין', '8', 'סגור'), false),
  known(card('U-03', 'חול', 'יש', '8', 'פתוח'), true),
  known(card('U-04', 'לבן', 'אין', '6', 'סגור'), false),
  known(card('U-05', 'לבן', 'אין', '8', 'פתוח'), false),
  known(card('U-06', 'חול', 'אין', '6', 'סגור'), false)
];

// ── round two: a rule made of TWO features ────────────────────────────
//
// אנטנה יש AND ארגז סגור. Written here 2026-09-16 because the station was
// one insight and ran in ninety seconds of a seven-minute slot; see
// docs/station-5-difficulty.md. These cards are not from the source — the
// source has no second round — so they were designed and then checked.
//
// The habit round one teaches is "find the one column that works", and
// round two breaks it twice in opposite directions: W-03 and W-04 have
// antennas and do not carry, W-05 and W-06 have closed boxes and do not
// carry. Neither column survives alone; together they explain all eight.
//
// VERIFIED, not asserted: 144 rules a person might actually propose —
// every single feature, every AND / OR / XOR of two, every AND / OR of
// three — were swept over these eight labels, and exactly one fits. No
// single feature fits. Round one was swept the same way and also comes out
// unique, at אנטנה יש. Kept honest by the station-5 data test.
//
// No unlabelled truck here repeats a labelled one, in either round, so
// nothing can be answered by matching a card instead of reading the rule.
export const LABELLED_2 = [
  known(card('W-01', 'לבן', 'יש', '6', 'סגור'), true),
  known(card('W-02', 'חול', 'יש', '8', 'סגור'), true),
  known(card('W-03', 'לבן', 'יש', '8', 'פתוח'), false),
  known(card('W-04', 'חול', 'יש', '6', 'פתוח'), false),
  known(card('W-05', 'לבן', 'אין', '6', 'סגור'), false),
  known(card('W-06', 'חול', 'אין', '8', 'סגור'), false),
  known(card('W-07', 'חול', 'אין', '6', 'פתוח'), false),
  known(card('W-08', 'לבן', 'אין', '8', 'פתוח'), false)
];

export const UNLABELLED_2 = [
  known(card('V-01', 'חול', 'יש', '6', 'סגור'), true),
  known(card('V-02', 'חול', 'יש', '8', 'פתוח'), false),
  known(card('V-03', 'לבן', 'יש', '8', 'סגור'), true),
  known(card('V-04', 'לבן', 'אין', '6', 'פתוח'), false)
];
