Name:      block-editor-app
Version:   %{version}
Release:   %{release}%{?dist}
Summary:   block-editor-app
Group:	   Development/Libraries
License:   MIT
URL:	   http://block-editor-app.com
Source0:   %{name}.tar.gz

%description
block-editor-app build package

%prep

%build

%install
mkdir %{buildroot}/usr/local/block_editor_app -p
tar xfz  %{SOURCE0} -C %{buildroot}/usr/local/block_editor_app

%clean
rm -rf %{buildroot}

%pre

%post

%files
%defattr(-,root,root)
/usr/local/block_editor_app

%changelog
