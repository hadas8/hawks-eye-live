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

// ── round two: two features that only mean anything together ──────────
//
// A truck carries when EXACTLY ONE of אנטנה יש / ארגז סגור holds — never
// both, never neither. Written here 2026-09-16; the source has no second
// round. See docs/station-5-difficulty.md.
//
// A conjunction was built first and thrown away for being too easy, and
// the reason is worth keeping: with an AND rule, the features that every
// carrier shares ARE the rule. One pass over the carriers hands it over
// and the non-carriers never get read. That is the same one-step move as
// round one, with two columns instead of one.
//
// This rule cannot be reached that way. Checked: the four carriers share
// NO feature, and neither do the four non-carriers, so intersecting either
// side yields nothing. The group has to notice that אנטנה means the
// opposite thing depending on the ארגז beside it — which is the whole idea
// of two features interacting, and is the only route in.
//
// VERIFIED, not asserted: 144 rules a person might propose — every single
// feature, every AND / OR / XOR of two, every AND / OR of three — were
// swept over these eight labels. Two survive, and they are the same
// function written from opposite ends (negating both sides of an XOR
// leaves it unchanged); they agree on every unlabelled truck. No single
// feature fits. Round one was swept the same way and is unique at אנטנה יש.
//
// The six to classify cover all four (אנטנה, ארגז) combinations, and no
// single feature predicts their answers either — so a group cannot land on
// all six while holding a wrong rule. None of them repeats a labelled
// truck, in either round.
export const LABELLED_2 = [
  known(card('W-01', 'לבן', 'יש', '6', 'פתוח'), true),
  known(card('W-02', 'חול', 'יש', '8', 'פתוח'), true),
  known(card('W-03', 'חול', 'אין', '6', 'סגור'), true),
  known(card('W-04', 'לבן', 'אין', '8', 'סגור'), true),
  known(card('W-05', 'לבן', 'יש', '8', 'סגור'), false),
  known(card('W-06', 'חול', 'יש', '6', 'סגור'), false),
  known(card('W-07', 'חול', 'אין', '8', 'פתוח'), false),
  known(card('W-08', 'לבן', 'אין', '6', 'פתוח'), false)
];

export const UNLABELLED_2 = [
  known(card('V-01', 'לבן', 'יש', '8', 'פתוח'), true),
  known(card('V-02', 'חול', 'יש', '6', 'פתוח'), true),
  known(card('V-03', 'חול', 'אין', '8', 'סגור'), true),
  known(card('V-04', 'לבן', 'יש', '6', 'סגור'), false),
  known(card('V-05', 'חול', 'יש', '8', 'סגור'), false),
  known(card('V-06', 'חול', 'אין', '6', 'פתוח'), false)
];
