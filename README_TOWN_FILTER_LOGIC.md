# BACARRA HUB town filtering

## Configured town sections
- BACARRA TOWNS: 44 entries
- VINTAR TOWNS: 19 entries
- PASUQUIN TOWNS: 32 entries
- MB TOWNS: 19 entries
- Total: 114 unique town names

MB TOWNS is displayed as its own section directly below PASUQUIN, but its 19 names are included in the PASUQUIN area classifier. The MB list is: Cabayo, Esperanza, Cabangaran, Canaam, Isic Isic, Bayog, Bago, Mabanbanag, San Jose (Lipay), Paayas, Dagupan, Namoroc, Bulbulala, Dipilat, Ester, Tamdagan, Visaya, Bobon, Davila.

## How parcel town matching works
1. The app reads the parcel's `Town Name` field.
2. It normalizes case and whitespace, converts Roman numerals I/II to 1/2, standardizes Santa/Santo to Sta./Sto., and removes recognized parenthetical locality notes such as `(Pob.)`, `(Diaton)`, `(Cababaan-Nalvo)`, `(Pragata-Bungro)`, and `(Peninaan-Malampa)`.
3. It applies explicit aliases such as Tubburan → Tuburan, Ngabangab → Nangabangab, Pedro F. Alviar (Diaton) → PF Alviar, Margaay → Margaay Vintar, and Canaan → Canaam.
4. It matches the normalized name against the configured town directory. I/II barangays remain separate entries; they are not merged.
5. MB TOWNS match individually and are assigned to PASUQUIN for parcel-area totals while displayed separately.
6. Zone ID validation is disabled. A Zone ID mismatch alone cannot mark a parcel Misrouted.
7. Station/destination validation remains independent. Unknown or blank town names can still be flagged for review, and a genuine station-route issue can still be flagged.

Destination Station must be Bacarra Hub for a row to enter this dashboard. Town matching determines whether it is assigned to BACARRA, VINTAR, or PASUQUIN (including MB TOWNS).
