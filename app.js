var rem = require('rem')
  , express = require('express')
  , path = require('path');

/**
 * Create Application
 */

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000); // sets up the port
  app.set('host', process.env.HOST || ('localhost:' + app.get('port')));
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "some arbitrary secret"
  }));
  app.use(express.favicon()); // default favicon
  app.use(express.logger('dev')); // error logging
  app.use(express.bodyParser()); // 
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public'))); // sets the path for public files (css & js)
})

/**
 * Facebook API
 */

 console.log(process.env);

var fb = rem.connect('facebook.com', '1.0').configure({
  key: process.env.FB_KEY,
  secret: process.env.FB_SECRET
});

// Crudely store user access tokens in a global hash for the duration of
// the Heroku app's life.
//
// In production, you would probably replace these with database-backed
// functions. As a convenience, these are written as asynchronous functions,
// though that's totally superfluous here.

var keys = {}
  , keyskey = 'im not actually a beggar, im actually a... magic man';

function hashUserId (id) {
  return require('crypto').createHmac('sha1', keyskey).update(id).digest('hex');
}

function storeCredentials (id, state, next) {
  keys[hashUserId(id)] = state;
  next(null);
}

function restoreCredentials (hash, next) {
  next(null, keys[hash]);
}

function clearStoredCredentials (id, next) {
  next(!(delete keys[hashUserId(id)]));
}

// The oauth middleware intercepts the callback url that we set when we
// created the oauth middleware.
var oauth = rem.oauth(fb, 'http://' + app.get('host') + '/oauth/callback/');
app.use(oauth.middleware(function (req, res, next) {
  console.log("User is now authenticated.");
  var user = oauth.session(req);
  user('me').get(function (err, json) {
    user.saveState(function (state) {
      if (err || !json.id) {
        res.redirect('/error');
      }

      storeCredentials(json.id, state, function () {
        res.redirect('/');
      });
    })
  });
}));
// Login route calls oauth.startSession, which redirects to an oauth URL.
app.get('/login/', oauth.login({
  scope: ['manage_notifications']
}));
// Logout route clears the user's session.
// Use middleware to clear the tokens from our tokens store as well.
app.get('/logout/', function (req, res, next) {
  var user = oauth.session(req);
  if (!user) {
    return next();
  }

  user('me').get(function (err, json) {
    if (json && json.id) {
      clearStoredCredentials(json.id, next);
    } else {
      next();
    }
  })
}, oauth.logout(function (req, res) {
  res.redirect('/');
}));


/**
 * Routes
 */

app.get('/error', function (req, res) {
  res.send('There was an error logging into Facebook. Please retry.');
});

app.get('/', function (req, res) {
  var user = oauth.session(req);
  if (!user) {
    res.setHeader('Content-Type', 'text/html');
    return res.send('<a href="/login/">Log in to NotificationLight.</a>', 400);
  }

  user('me').get(function (err, json) {
    var path = '/action/' + hashUserId(json.id);

    res.setHeader('Content-Type', 'text/html');
    res.write('<p>NotificationLight Demo! The current acting Facebook user is <a href="https:/facebook.com/' + json.id + '">' + json.id + '</a>.</p>');
    res.write('<p>send a GET request to <a href="http://' + app.get('host') + path + '">http://' + app.get('host') + path + '</a> to check your notifications:</p>');
    res.write('<form action="' + path + '" method="get"><button>Check number of notifications</button></form>')
    res.write('<p><a href="/logout/">Logout from NotificationLight.</a></p>');
    res.end();
  })
});

app.get('/action/:user', function (req, res) {
  restoreCredentials(req.params.user, function (err, tokens) {
    if (!tokens) {
      return res.json({message: 'Invalid or expired id.'}, 400);
    }

    // Attempt to restore the tokens. Validate whether the session remains valid.
    var user = oauth.restore(tokens);
    user.validate(function (valid) {
      if (!valid) {
        clearStoredCredentials(req.param.user, function () {
          oauth.clearSession(req);
          return res.json({message: 'Expired Facebook credentials. Please log in again.'}, 400);
        });
      }

      user('/me/notifications?').get(function(err, data){
        console.log("notifications", data);
        res.setHeader('Content-Type', 'text/html');
        if (data.summary.unseen_count) {
          res.write(String(data.summary.unseen_count));
        } else {
          res.write("0");
        }
        res.end();
      });
    });
  });
})

/**
 * Launch
 */

app.listen(app.get('port'), function () {
  console.log('Running on http://' + app.get('host'));
})