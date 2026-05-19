#!/bin/bash
# Extract the modals
sed -n '713,892p' src/pages/AgencyDashboard.jsx > temp_modals.jsx
# Remove the modals from RoomGrid
sed -i.bak '713,892d' src/pages/AgencyDashboard.jsx
# Insert the modals before the closing div and closing brace of AgencyDashboard (around line 637)
# Line 637 is:     </div>
# Line 638 is:   );
# We can inject before line 637.
sed -i.bak '636r temp_modals.jsx' src/pages/AgencyDashboard.jsx
rm temp_modals.jsx
