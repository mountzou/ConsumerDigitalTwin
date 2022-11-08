import json
import urllib
from urllib.parse import urljoin
from urllib.request import urlopen, Request
import http.client
import mimetypes
import os
import re

__version__ = '6.0.0.1'

# from http://blog.spotflux.com/uploading-files-python-3/
def encode_multipart_formdata(fields, files):
    """
    fields is a sequence of (name, value) elements for regular form fields.
    files is a sequence of (name, filename) elements for
    data to be uploaded as files
    Return (content_type, body) ready for http.client connection instance
    """
    BOUNDARY_STR = '----------ThIs_Is_tHe_bouNdaRY_$'
    CRLF = bytes("\r\n", "ASCII")
    L = []
    if fields is not None:
        for key, value in fields.items():
            L.append(bytes("--" + BOUNDARY_STR, "ASCII"))
            L.append(bytes('Content-Disposition: form-data; name="%s"' % key, "ASCII"))
            L.append(b'')
            L.append(bytes(value, "ASCII"))
    if files is not None:
        print(os.getcwd())
        for key, filename in files.items():
            L.append(bytes('--' + BOUNDARY_STR, "ASCII"))
            L.append(bytes('Content-Disposition: form-data; name="%s"; filename="%s"' % (key, filename), "ASCII"))
            L.append(bytes('Content-Type: %s' % get_content_type(filename),
                           "ASCII"))
            L.append(b'')
            with open(filename, 'rb') as f:
                byte = f.read()
                while byte:
                    L.append(byte)
                    byte = f.read()

    L.append(bytes('--' + BOUNDARY_STR + '--', "ASCII"))
    L.append(b'')
    body = CRLF.join(L)
    content_type = 'multipart/form-data; boundary=' + BOUNDARY_STR
    return content_type, body


def get_content_type(filename):
    return mimetypes.guess_type(filename)[0] or 'application/octet-stream'


# end http://blog.spotflux.com/uploading-files-python-3/
p = re.compile('{[^}]+[}]')

trace_urls = False
disable_redirection = False


def expand_url(url, args):
    """
    performs template expansion on an url according to the {name}, {?name}, {&name}, {/name} and {?name*} patterns
    url is a string
    args is a dict
    """
    has_query = False

    def encode(value):
        return urllib.parse.quote(value, safe='~()*.\'')

    def encode_spaces(value):
        return value.replace(' ', '%20')

    def replace(match):
        nonlocal has_query

        part = match.group()
        query = part[1]

        if query == '/' or query == '&' or query == ';' or query == '+' or query == '#' or query == '.':
            pass
        elif query == '?':
            if has_query:
                query = '&'
        else:
            query = None

        result = ''

        def append(first, prop, value, length, keys):
            nonlocal query, result, has_query

            value = str(value) if length is None else str(value)[:length]

            if query is None:
                if result != '':
                    result += ','
                if keys:
                    result += prop + '='
                result += encode(value)
            elif query == '/':
                result += '/' if first else ','
                if keys:
                    result += prop + '='
                result += encode(value)
            elif query == '+':
                if result != '':
                    result += ','
                if keys:
                    result += prop + '='
                result += encode_spaces(value)
            elif query == '#':
                result += ('#' if result == '' else ',')
                if keys:
                    result += prop + '='
                result += encode_spaces(value)
            elif query == '.':
                result += ('.' if first else ',')
                if keys:
                    if first and prop:
                        result += prop + '='
                    result += encode(value)
                else:
                    result += encode_spaces(value)
            elif query == ';':
                e = encode(value)
                if first:
                    result += ';' + (prop + '=' + e if e != '' else prop)
                else:
                    result += ',' + e
            elif query == '?':
                result += (query + prop + '=' if first else ',') + \
                    encode(value)
                has_query = True
                query = '&'
            else:
                result += (query + prop + '=' if first else ',') + \
                    encode(value)
                has_query = True

        for term in part[2 if query else 1:-1].split(','):
            multi = term[-1] == '*'
            colon = term.find(':')

            if colon > 0:
                length = int(term[colon + 1:])
                prop = term[:colon]
            else:
                length = None
                prop = term if not(multi) else term[:-1]

            if prop not in args:
                if trace_urls:
                    print('prop: %s not present' % prop)
                continue

            arg = args[prop]

            if isinstance(arg, list):
                for i in range(0, len(arg)):
                    append(i == 0 or multi, prop, arg[i], length, False)
            elif isinstance(arg, dict):
                if multi:
                    for k, v in arg.items():
                        append(True, k, v, length, True)
                else:
                    # handling of dict values for the '.' expansion is different
                    # to the others so we pass a None prop when we don't want it
                    # to appear
                    first = True
                    keys = query == '.'
                    if keys:
                        prop = None
                    for k, v in arg.items():
                        append(first, prop, k, length, keys)
                        first = False
                        append(False, prop, v, length, keys)
            else:
                append(True, prop, arg, length, False)

        return result

    url = p.sub(replace, url)

    if trace_urls:
        print('accessing URL %s' % url)

    return url


request_timeout = 100

def open_request(req):
    if disable_redirection:
        req.add_header('x-post-redirect', 'false')
    return urlopen(req, timeout=request_timeout)

class Api(object):
    """
    The Api object has a token and a root URL for API access to a SCAN project.

    The API token is created for a specific project and allows a script to
    impersonate that user.  see 'API tokens' under the project menu

    set the base URL of the project the token is for, obtained from the
    link at the bottom of the project's 'API tokens' page.
    e.g.  BASE_URL = 'https://scan.iseve.com/project/ApiTestProject'

    root = open_api(BASE_URL, API_TOKEN)

    get and post helpers for JSON and raw data, inserting the bearer token into
    the Authorization header
    """

    def __init__(self, base_url, api_token):
        self._base_url = base_url
        self._api_token = api_token

    def root(self):
        """GET the api object for the base URL of the project"""
        req = Request(self._base_url)
        req.add_header('Authorization', 'Bearer ' + self._api_token)
        res = open_request(req)
        root = ApiObject(self, json.loads(res.read().decode(res.info().get_param('charset') or 'utf-8')))
        root._links['self'] = {'href': res.url}
        return root

    def get_json(self, url, **kwargs):
        """GET the url relative to the base url and return a dict populated from the returned json"""
        url = expand_url(url, kwargs)
        req = Request(urljoin(self._base_url, url))
        req.add_header('Authorization', 'Bearer ' + self._api_token)
        res = open_request(req)
        return json.loads(res.read().decode(res.info().get_param('charset') or 'utf-8')), res.url

    def _get_object(self, url, **kwargs):
        return self._to_object(*self.get_json(url, **kwargs))

    def _send_object(self, url, method, data, **kwargs):
        return self._to_object(*self._send_json(url, method, data, **kwargs))

    def _to_object(self, json, url=None):
        if 'Error' in json:
            raise ApiError(self, json['Message'])
        return ApiObject(self, json, url)

    def get_raw(self, url, **kwargs):
        """GET the url relative to the base url and return the response"""
        url = expand_url(url, kwargs)
        req = Request(urljoin(self._base_url, url))
        req.add_header('Authorization', 'Bearer ' + self._api_token)
        return open_request(req)

    def post_json(self, url, data, **kwargs):
        """POST the given data to the url relative to the base url and return a dict populated from the returned json"""
        url = expand_url(url, kwargs)
        req = Request(urljoin(self._base_url, url),
                      json.dumps(data).encode('utf-8'))
        req.add_header('Authorization', 'Bearer ' + self._api_token)
        req.add_header('Content-Type', 'application/json')
        res = open_request(req)
        return json.loads(res.read().decode(res.info().get_param('charset') or 'utf-8')), res.url

    def _send_json(self, url, method, data, **kwargs):
        """send via the specified method the given data to the url relative to the base url and return a dict populated from the returned json"""
        url = expand_url(url, kwargs)
        req = Request(urljoin(self._base_url, url),
                      json.dumps(data or {}).encode('utf-8'),
                      method=method)
        req.add_header('Authorization', 'Bearer ' + self._api_token)
        req.add_header('Content-Type', 'application/json')
        res = open_request(req)
        return json.loads(res.read().decode(res.info().get_param('charset') or 'utf-8')), res.url

    def post_raw(self, url, data, content_type, **kwargs):
        """POST the given data to the url relative to the base url and return the response"""
        url = expand_url(url, kwargs)
        req = Request(urljoin(self._base_url, url), data)
        req.add_header('Authorization', 'Bearer ' + self._api_token)
        req.add_header('Content-Type', content_type)
        return open_request(req)

    def put_raw(self, url, data, content_type, **kwargs):
        """PUT the given data to the url relative to the base url and return the response"""
        url = expand_url(url, kwargs)
        req = Request(urljoin(self._base_url, url), data, method='PUT')
        req.add_header('Authorization', 'Bearer ' + self._api_token)
        req.add_header('Content-Type', content_type)
        return open_request(req)


def to_api_object_recurse(api, data):
    return ApiObject(api, data) if isinstance(data, dict) else data


class ApiError(Exception):
    def __init__(self, source, message):
        self.source = source
        self.message = message

    def __str__(self):
        return repr(self.message)


class ApiObject(object):
    """Wraps the endpoints in the json API as actions on objects and their properties."""

    def __str__(self):
        name = self.DisplayName if 'DisplayName' in self.__dict__ else '?'
        item = self.ItemName if 'ItemName' in self.__dict__ else '?'
        link = self._links['self']['href'] if 'self' in self._links else '?'
        return '<ApiObject `{0}` [{1}] @ {2} = {3}>'.format(name, item, link, self.to_data())

    def __init__(self, api, parms, url=None):
        self._api = api
        self._links = {}
        self._embedded = {}
        # if an url is passed, it is the url used to get this object, so can be
        # used to refresh it
        if url is not None:
            self._links['self'] = {'href': url}
        if isinstance(parms, dict):
            self._update(parms)

    def _href(self, relation):
        link = self._links.get(relation)
        if link is None:
            raise ValueError('api object has no relation `' + relation + '`')
        return link['href']
        
    def get(self, relation, **kwargs):
        """GET the related url for the object and return an ApiObject populated from the returned json"""
        if relation in self._embedded and len(kwargs) == 0:
            return self._embedded[relation]
        result = self._api._get_object(self._href(relation), **kwargs)

        if len(kwargs) == 0:
            self._embedded[relation] = result

        return result

    def get_raw(self, relation, **kwargs):
        """GET the related url for the object and return the raw data"""
        return self._api.get_raw(self._href(relation), **kwargs)

    def post(self, relation, data, **kwargs):
        """POST the data to the related url for the object and return an ApiObject populated from the returned json. Data may be dict, list, primitve or ApiObject"""
        return self._api._send_object(self._href(relation), 'POST', value_to_data(data), **kwargs)

    def put(self, relation, data, **kwargs):
        """PUT the data to the related url for the object and return an ApiObject populated from the returned json. Data may be dict, list, primitve or ApiObject"""
        return self._api._send_object(self._href(relation), 'PUT', value_to_data(data), **kwargs)

    def patch(self, relation, data, **kwargs):
        """PATCH the data to the related url for the object and return an ApiObject populated from the returned json. Data may be dict, list, primitve or ApiObject"""
        return self._api._send_object(self._href(relation), 'PATCH', value_to_data(data), **kwargs)

    def delete(self, relation, **kwargs):
        """DELETE the related url for the object and return an ApiObject populated from the returned json. Data may be dict, list, primitve or ApiObject"""
        return self._api._send_object(self._href(relation), 'DELETE', None, **kwargs)

    def post_files(self, relation, data, files):
        """POST the contents of the file to the related url for the object and return an ApiObject populated from the returned json."""

        content_type, body = encode_multipart_formdata(data, files)
        api = self._api
        res = api.post_raw(self._href(relation), body, content_type)
        return api._to_object(json.loads(res.read().decode(res.info().get_param('charset') or 'utf-8')))

    def put_file(self, relation, filename):
        """PUTs the contents of the file to the related url for the object and return an ApiObject populated from the returned json."""

        with open(filename, 'rb') as f:
            byte = f.read()

        api = self._api
        url = self._href(relation)
        res = api.put_raw(url, byte, 'application/octet-stream')
        return api._to_object(json.loads(res.read().decode(res.info().get_param('charset') or 'utf-8')), url)

    def refresh(self):
        """Fetch the object's data again via its 'self' link. if no 'self' link is present, gets 'details' or throws an error"""

        link = self._links.get('self', None) or self._links.get('details', None) or self._links.get('refresh', None)
        
        if link is None:
            raise ValueError("This api object has neither a 'self', 'details' nor 'refresh' relation so cannot be refreshed.")
        if 'templated' in link:
            raise ValueError("This api object has templated 'self' relation so cannot be refreshed.")
        json_data,redirected_url = self._api.get_json(link['href'])
        self._update(json_data)
        self._links['self'] = {'href':redirected_url}
        return self

    def update(self):
        """Saves any changes made to the object by post the object's data to its 'update' link"""

        link = self._links.get('update')
        if link is None:
            raise ValueError('api object has no update relation so cannot be updated')
        update, redirected_url = self._api.post_json(link['href'], self.to_data())
        self._update(update)
        self._links['self'] = {'href':redirected_url}
        return self

    def _update(self, update):
        if 'Error' in update:
            raise ApiError(self, update['Message'])

        api = self._api

        if '_links' in update:
            self._links.update(update['_links'])
            del update['_links']

        self._embedded = {}

        if '_embedded' in update:
            for k, v in update['_embedded'].items():
                if isinstance(v, dict) and '_links' in v:
                    self._embedded[k] = ApiObject(api, v)
                elif isinstance(v, list):
                    self._embedded[k] = [
                        to_api_object_recurse(api, item) for item in v]
            del update['_embedded']

        for k, v in update.items():
            if isinstance(v, dict) and '_links' in v:
                update[k] = ApiObject(api, v)
            elif isinstance(v, list):
                update[k] = [to_api_object_recurse(api, item) for item in v]

        self.__dict__.update(update)

        return self

    def to_data(self):
        """Convert to a dict suitable for JSON serialisation"""
        return dict_to_data(self.__dict__)

    def linked_resources(self):
        """list the names of the linked resources"""
        return list(self._links.keys())

    def link_details(self, relation):
        """returns the details of the link to the given resource"""
        return self._links[relation] or None


def dict_to_data(d):
    data = {}

    for k, v in d.items():
        if k == '_links':
            continue
        if k == '_api':
            continue
        if k == '_embedded':
            continue
        data[k] = value_to_data(v)

    return data


def value_to_data(v):
    if type(v) is ApiObject:
        return v.to_data()
    elif isinstance(v, list):
        return [value_to_data(item) for item in v]
    elif isinstance(v, dict):
        return dict_to_data(v)
    else:
        return v


def open_api(base_url, api_token):
    return Api(base_url, api_token).root()


def open_token(path=None):
    with open(path or 'scan.token', 'r') as f:
        server_url = f.readline().rstrip()
        api_token = f.readline().rstrip()
        root_url = f.readline().rstrip()
        root = open_api(root_url, api_token)
        line = f.readline()
        building = None

        # the building is the building with the corresponding details link
        if line:
            building_url = line.rstrip()[len(server_url) - 1:]
            try:
                building = next(item.refresh() for item in root.Buildings if item._links['details']['href'] == building_url)
            except:
                pass
    return root, building, server_url
