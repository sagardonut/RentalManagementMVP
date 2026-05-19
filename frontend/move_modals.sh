#!/bin/bash
# Modals are currently from 637 to 816
sed -n '637,816p' src/pages/AgencyDashboard.jsx > temp_modals2.jsx
# Delete from current position
sed -i.bak '637,816d' src/pages/AgencyDashboard.jsx
# Insert before line 545 (which is currently line 545 since deletion happened after it)
sed -i.bak '544r temp_modals2.jsx' src/pages/AgencyDashboard.jsx
rm temp_modals2.jsx
