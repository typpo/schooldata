#!/bin/bash

pushd `dirname $0`

wget http://nces.ed.gov/ccd/Data/zip/ccd_sch_029_1415_w_0216601a_txt.zip
wget http://nces.ed.gov/ccd/Data/zip/ccd_rpgm_029_1415_w_0216161a_txt.zip
wget http://nces.ed.gov/ccd/Data/zip/ccd_sch_052_1415_w_0216161a_txt.zip
wget http://nces.ed.gov/ccd/Data/zip/ccd_sch_059_1415_w_0216161a_txt.zip
wget http://nces.ed.gov/ccd/Data/zip/ccd_sch_129_1415_w_0216161a_txt.zip
wget http://nces.ed.gov/ccd/Data/zip/ccd_sch_033_1415_w_0216161a_txt.zip

wget http://nces.ed.gov/ccd/xls/2014-15%20CCD%20Companion_SCH%20Directory_File_Layout.xlsx
wget http://nces.ed.gov/ccd/xls/2014-15%20CCD%20Companion_SCH%20Reportable%20Programs_File_Layout.xlsx
wget http://nces.ed.gov/ccd/xls/2014-15%20CCD%20Companion_School%20Membership_File_Layout.xlsx
wget http://nces.ed.gov/ccd/xls/2014-15%20CCD%20Companion_SCH%20Staff_File_Layout.xlsx
wget http://nces.ed.gov/ccd/xls/2014-15%20CCD%20Companion_SCH%20CCD%20School_File_Layout.xlsx
wget http://nces.ed.gov/ccd/xls/2014-15%20CCD%20Companion_SCH%20Free%20Lunch_File_Layout.xlsx

unzip \*.zip

popd
