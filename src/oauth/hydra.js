import fetch from 'node-fetch';

const hydraUrl = process.env.HYDRA_ADMIN_URL;

async function get(flow, challenge) {
  const url = `${hydraUrl}/oauth2/auth/requests/${flow}/?${flow}_challenge=${challenge}`;
  const resp = await fetch(url);
  if (resp.status < 200 || resp.status > 302) {
    throw new Error(`An error occured making request: ${(await resp.json())}`);
  }
  return resp.json();
}

async function put(flow, action, challenge, body) {
  const url = `${hydraUrl}/oauth2/auth/requests/${flow}/${action}/?${flow}_challenge=${challenge}`;
  const resp = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (resp.status < 200 || resp.status > 302) {
    throw new Error(`An error occured making request: ${(await resp.json())}`);
  }
  return resp.json();
}

const hydra = {
  // Fetches information on a login request.
  getLoginRequest(challenge) {
    return get('login', challenge);
  },
  // Accepts a login request.
  acceptLoginRequest(challenge, body) {
    return put('login', 'accept', challenge, body);
  },
  // Rejects a login request.
  rejectLoginRequest(challenge, body) {
    return put('login', 'reject', challenge, body);
  },
  // Fetches information on a consent request.
  getConsentRequest(challenge) {
    return get('consent', challenge);
  },
  // Accepts a consent request.
  acceptConsentRequest(challenge, body) {
    return put('consent', 'accept', challenge, body);
  },
  // Rejects a consent request.
  rejectConsentRequest(challenge, body) {
    return put('consent', 'reject', challenge, body);
  },
  // Fetches information on a logout request.
  getLogoutRequest(challenge) {
    return get('logout', challenge);
  },
  // Accepts a logout request.
  acceptLogoutRequest(challenge) {
    return put('logout', 'accept', challenge, {});
  },
  // Reject a logout request.
  rejectLogoutRequest(challenge) {
    return put('logout', 'reject', challenge, {});
  },
};

export default hydra;
