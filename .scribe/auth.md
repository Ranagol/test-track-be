# Authenticating requests

To authenticate requests, include a query parameter **`session`** in the request.

All authenticated endpoints are marked with a `requires authentication` badge in the documentation below.

This API uses <strong>Sanctum session-based authentication</strong>, not Bearer tokens. <br/><br/>To authenticate:<br/>1. Send a POST request to <code>/api/login</code> with your credentials<br/>2. The session cookie will be automatically included in subsequent requests<br/>3. Use the "Try It Out" feature below to test authenticated endpoints.
