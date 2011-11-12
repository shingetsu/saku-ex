'''Cron daemon running in another thread for client.cgi.
'''
#
# Copyright (c) 2005,2011 shinGETsu Project.
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
# 1. Redistributions of source code must retain the above copyright
#    notice, this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright
#    notice, this list of conditions and the following disclaimer in the
#    documentation and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE AUTHORS AND CONTRIBUTORS ``AS IS'' AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHORS OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
# OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
# HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
# LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
# OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
# SUCH DAMAGE.
#
# $Id$
#

import dircache
import re
import urllib
import sys
import time
from threading import Thread
from urllib import urlopen

import config
import tiedobj

__version__ = "$Revision$"

class Client(Thread):

    """Access client.cgi."""

    def __init__(self):
        Thread.__init__(self)

    def run(self):
        try:
            con = urlopen("http://localhost:%d%s" %
                          (config.port, config.client),
                          proxies={})
            con.close()
        except IOError:
            pass
        sys.stdout.flush()
        sys.stderr.flush()

class Crond(Thread):

    """Cron daemon running in another thread for client.cgi."""

    def __init__(self):
        Thread.__init__(self)

    def run(self):
        time.sleep(5)
        while True:
            self.clear_cache()
            now = int(time.time())
            Client().start()
            time.sleep(config.client_cycle)

    def clear_cache(self):
        try:
            re.purge()
            dircache.reset()
            tiedobj.reset()
        except Exception, err:
            sys.stderr.write('Crond.clear_cache(): %s\n' % err)
