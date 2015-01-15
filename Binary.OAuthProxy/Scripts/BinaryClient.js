if (!window.console)
{
	window.console = { log: function () { } };
};

OAuthTypes = {
	AuthCodeFlow: "authcodeflow",
	ImplicitFlow: "implicitflow",
};

function BinaryClient(authEndPoint, clientId)
{
	this.OAuthEndPoint = authEndPoint;
	this.OAuthClientId = clientId;
	this.OAuthInfoKey = "OAuthInfo";
};

//BinaryClient.prototype.constructor = new BinaryClient();

BinaryClient.prototype.GetAuthInfo = function ()
{
	var storedAuthInfo = window.localStorage.getItem(this.OAuthInfoKey);
	if (storedAuthInfo)
	{
		return JSON.parse(storedAuthInfo);
	}
	else
	{
		return { status: "notauth" };
	}
};

BinaryClient.prototype.SetAuthInfo = function (authInfo)
{
	this.TimeExecuted = new Date();
	this.TimeExpration = new Date(this.TimeExecuted.getTime() + (authInfo.expires_in - 1 * 60) * 1000);
	//coneols.log(JSON.stringify(authInfo));
	window.localStorage.setItem(this.OAuthInfoKey, JSON.stringify(authInfo));
};

BinaryClient.prototype.IsAuthNeeded = function ()
{
	var authInfo = this.GetAuthInfo();

	return authInfo.status != "approved" || this.TimeExpiration < new Date();
};

BinaryClient.prototype.AuthorizeWebClient = function (callbackUrl, scope)
{
	var url = this.OAuthEndPoint + "oauth/authorize" +
        "?response_type=code" +
        "&client_id=" + this.OAuthClientId +
        "&callback_url=" + callbackUrl +
        "&scope=" + scope +
        "&state=" + OAuthTypes.AuthCodeFlow;

	window.location.href = url;
};

BinaryClient.prototype.AuthorizeMobileClient = function (callbackUrl, scope)
{
	var url = this.OAuthEndPoint + "oauth/authorize" +
        "?response_type=token" +
        "&client_id=" + this.OAuthClientId +
        "&callback_url=" + callbackUrl +
        "&scope=" + scope +
        "&state=" + OAuthTypes.ImplicitFlow;

	window.location.href = url;
};
