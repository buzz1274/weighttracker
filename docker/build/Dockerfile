# Version 0.0.1
FROM centos:6.6
MAINTAINER David Exelby "david@sulaco.co.uk"

COPY yum.repos /etc/yum.repos.d/CentOS-Base.repo
RUN yum update -y && \
    yum install -y tar && \
    yum install -y wget && \
    yum groupinstall -y development && \
    yum install -y httpd

#install postgresql
RUN yum install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-6-x86_64/pgdg-redhat-repo-latest.noarch.rpm && \
    yum install -y postgresql12

#configure php
RUN yum install -y php && \
    yum install -y php-devel && \
    yum install -y pcre-devel && \
    yum install -y php-pear && \
    yum install -y php-pgsql && \
    yum install -y php-pdo && \
    pear config-set php_ini /etc/php.ini && \
    rpm -Uvh https://mirror.webtatic.com/yum/el6/latest.rpm && \
    yum install -y yum-plugin-replace && \
    yum replace -y php-common --replace-with=php55w-common && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/bin --filename=composer

#install phalcon
WORKDIR /usr/local
RUN wget https://github.com/phalcon/cphalcon/archive/refs/tags/v3.0.0.tar.gz && \
    tar -xzvf v3.0.0.tar.gz && \
    rm v3.0.0.tar.gz
WORKDIR /usr/local/cphalcon-3.0.0/build
RUN ./install
RUN echo extension=phalcon.so >> /etc/php.d/phalcon.ini

#configure httpd.conf
RUN rm -rf /var/www/cgi-bin
RUN rm -rf /var/www/icons
RUN rm -rf /var/www/error
COPY weighttracker.zz50.co.uk.conf /etc/httpd/conf.d/weighttracker.zz50.co.uk.conf

WORKDIR /
ENTRYPOINT /usr/sbin/httpd -DFOREGROUND
EXPOSE 80
EXPOSE 443