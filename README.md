# MobX Dispatcher

**Warning**

- This repository is not part of mobx project
- Project is still under development, please use with caution

## What is this;

MobX Dispatcher is a manager of mobx states and simple but suprisingly powerful functional router. The idea behind the project is to give the state 100% control of rendered content instead of sharing logic with component based routers like react-router.

## How does it work?

### Stores management

MobX Dispatcher take cares of all your store classes. So instead of this:

```javascript
const stores = {
  content: new ContentStore(),
  ui: new UIStore(),
  auth: new AuthStore(),
  etc: EtcStore()
}

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

you can write this:

```javascript
import Dispatcher from 'mobx-dispatcher';

const dispatcher = new Dispatcher();

dispatcher.attachStore(ContentStore);
dispatcher.attachStore(UIStore, 'ui'); //Because uI ooks kind of weird
dispatcher.attachStore(AuthStore);
dispatcher.attachStore(EtcStore);

dispatcher.start() //call when all the stores are attached and you want to render initial page

ReactDOM.render(
  <Provider {...dispatcher.stores}>
    <App />
  </Provider>,
  document.getElementById('root')
);

console.log(Object.keys(dispatcher.stores)) // ['content', 'ui', auth', 'etc', 'nav']
```

Sounds boring? It's not all!

### Stores access and callbacks

By attaching your store class to the dispatcher, your store objects will receive _stores_ property so they can easily access  properties and/or actions of other stores.

Also, Stores attached to dispatcher can use two callbacsk:

_onAttach_ is called, suprisingly, when the store is attached to the dispatcher.
_onRouterStart_ is triggered when dispatcher.start() function is called.

Not amazed yet? Let's wait for...

### Routing

State management and callbacks are cool, but they are not the reason why this library was written. So, how does the routing works? 

Every store assigned to MobX Dispatcher can register it own routes. The best place to do it is, of course in the _onAttach_ callback. Lets check this example;

```javascript
class AuthStore {

  @observable userSiged = false;

  onAttach() {
    this.addRoute('/signin', () => { this.showSignupPage()})
  }
  @action showSignupPage() {
    if (this.userSigned) {
      this.stores.ui.showMessage("You are already signed");
      this.changePath('/');
    } else {
      this.stores.ui.showComponent('signin');
    }
  }
}
```

As you might can see, the Dispatcher not only adds the _stores_ property, but also provides three extra methods:

- navigateTo(_path_) change the route in the browser and refresh the page
- changePath(_path_) unlike _navigateTo_, changePath does not keep previous page in user history
- addRoute(_path_,_callback_) map the route to the store action. *Always define callback as arrow function!*

#### Routing from components

If you are using MobX Dispatcher together with react, you might be curious how to access router from your components. If you paid attention in our second example, you might noticed that we attached four stores to the component but _dispatcher.stores_ actually had five items. The _nav_ store is provided automatically by Dispatcher and you can access is as any other MobX store.

```javascript
@connectTo('nav')
class Navigation extends Component {
  render() {
    return(
      <Navbar>
        <NavItem active={this.props.nav.path === "/"} onClick={ this.props.nav.goTo("/")}>Home</NavItem>
      </Navbar>
    );
  }
}
```
actions _goTo_ and _changeTo_ are equivalent to the store methods navigateTo and _changePath_.

### How to use route parameters?

Simply!

```javascript
class ContentStore {
  @action showCategory(id,page) {
    //...loadSomeData from backand
  }

  onAttach() {
    this.addRoute('/category/:id/page/:page', ({id,page}) => { this.showCategory(id,page)}
  }
}
```

## FAQ

**Q:** Which patterns can I use in my routes?  
**A:** Dispatcher is using https://github.com/rcs/route-parser. Check it to learn more about route patterns

**Q:** Why should I use it?  
**A:** If you are happy with your current router then you probably should not. The basic idea behind this is actually super simple. To avoid the separation of app logic between router and global state, all routes are directly maps to store actions.

**Q:** I like this but I am missing some functionality:  
**A:** Fork it and implement it. Or make a pull request. Or write a suggestions and maybe I can really add it

