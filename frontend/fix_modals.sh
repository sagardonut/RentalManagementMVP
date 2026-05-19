#!/bin/bash
# Remove the improperly placed modals from 545 to 724
sed -n '545,724p' src/pages/AgencyDashboard.jsx > temp_modals3.jsx
sed -i.bak '545,724d' src/pages/AgencyDashboard.jsx

# Insert them before line 544 (the final closing div)
sed -i.bak '543r temp_modals3.jsx' src/pages/AgencyDashboard.jsx
rm temp_modals3.jsx
