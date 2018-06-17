#!/bin/sh

jsonFile=package.json

node > out_${jsonFile} <<EOF
var data = require('./${jsonFile}')
data.version = "$1";
console.log(JSON.stringify(data));
EOF

rm package.json
mv out_package.json package.json

archiveFile="driver-network@$1.bna"

bash ~/fabric-dev-servers/startFabric.sh

rm *.bna
git rm *.bna
git commit -m "Commit version $1"
git push -u origin master

composer archive create -t dir -n .
composer network install -c PeerAdmin@hlfv1 -a $archiveFile
composer network start --card PeerAdmin@hlfv1 --networkAdmin admin  --networkName driver-network --networkVersion "$1" --networkAdminEnrollSecret adminpw  --file networkadmin.card

git rm *.bna
git commit -m "Commit version $1"
git push -u origin master

git add *
git commit -m "Commit version $1"
git push -u origin master

#composer-rest-server -c admin@driver-network -n never -w true
