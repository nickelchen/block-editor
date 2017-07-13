#!/bin/bash
set -e -x

package_name=block-editor-app

echo 'prepare...'
rpmbuild_dir=/root/rpmbuild
ln -s `pwd`/contrib $rpmbuild_dir

pip install pbr
version=`python setup.py --version`
release=1
spec=$package_name.spec
sed -i "2i\%define version ${version}\n%define release ${release}" contrib/SPECS/$spec

echo 'rpmbuild...'
npm run build
cd dist
tar -zcvf ../contrib/SOURCES/block-editor-app.tar.gz .
cd ../

yum-builddep -y contrib/SPECS/$spec
rpmbuild -ba contrib/SPECS/$spec --define "dist .el7"

echo 'done'
