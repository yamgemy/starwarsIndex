# starwarsIndex

The repository contains an example application written in React Native on plain JavaScript, with its states primarily managed by Redux and Redux-observable, with a (few) exception(s) to it having non-shared UI-related states locally embedded in components using React.useState. The landing page consists of a paginated list of characters with their names and homeworlds as plain texts, each inside a clickable list items. Clicking a character list item will navigate to another screen that displays an graphical avatar based on the character's attributes like hair color and gender etc. Data is obtain via http requests from the public [StarWars api] (https://swapi.py4e.com/). Each individual Requests are managed by Axios, with a custom implementation that enables request retries should the server return no response.

## Redux and observable
The primary reason for using Redux over other state libraries is my familiarity with it's usage as well as the convenience to track each individual invocation of state change and thereafter compose subsequent courses of actions. Instead of using Thunks, the application leverages rxJs to coordinate a collection of 'redux actions'. For example, it enables a strict ordering of actions to take place, which i often find necessary to ensure data from the previous actions are put in place in the Redux store, before the next actions take place should these actions rely on retrieving the previously obtained data from the store. While this by and large could be done with Thunks and useEffect, i conceded this approach is cleaner, as it decouples state logic completely from the UI components.

There seems to have been growing popularity with React-Query. However, while the concept of separating communication/data states from UI states seem to make certain sense, it seems to imply a tight coupling between UI components and data-fetching logic. When it comes to caching I use Redux-persist to achieve the same purpose. On the bottom line, I'm yet to familiarize myself with actual implementations of React-Query and instead under the constrains of time, i work with what i already know (or rather, having one foot on the door).

## Axios and request retry
Axios is employed over the built-in fetch function for the sake of (perhaps more structurally) enabling customization of error handling. For example I used Axios's interceptor to tailor for specific error scenarios based on the information contained in the return Error objects: and in this case, when the server returns no response (server downtime), i retry the request; and when the server *does give* a response minus actual data, it is assumed unnecessary to retry the request (**She already said no!**), then the UI simply manifests accordingly.

As mentioned, I have implemented a retry mechanism for individual requests. This is done by invoking the requests inside Js Promises, and their failures lead to a recursion of the enveloping Promise itself, until an arbitrary limit of retry count is reached. It was found necessary to cancel the previous requests to correctly facilitate individual timeouts, and so an implementation of axios.CancelToken was also put in place.

## On minimizing API requests
Perhaps a more straightforward production approach to this would be to persist what's already requested once during the lifetime of the app installation, so as to not repeat requesting again, but for demonstration purpose, the current state of implementation is left at starting all data states from a blank slate so you can observe how data is being fetched:

Currently, the minimal number of requests on character information is being dictated by the StarWars API. Intuitively, it only takes 1 single request to fetch an entire list of data, but the StarWars' people API only have a *paged* request endpoint available. And so that means it takes as many requests as there are pages of characters in the database, and in this case roughly 9 pages. So there are already a minimal of 9 requests to get all the characters. This also implies the UI has to manifest itself accordingly in a manner of scroll-to-load-more. I tried to execute these requests consecutively, and it felt that the requests took too long to complete (more than a few seconds), and at the same time each page of character immediately leads to varying number of request of their homeworlds. And so this approach was ditched because it took too long and clutters up the UX, as well as the fact that perhaps the user is only interested in the first couple pages, for instance. There was no urgency to load everything at once.

On the other hand, as mentioned also, there are homeworlds data to be requested. It would be obvious there are more biological/mechanical entities than there are planets in which they inhibit. And it is indeed true in the StarWars universe (i would be surprised if it was the otherwise in any other universes). And so that means some characters share the same homeworld/planet, which implies that during the runtime, when specific homeworld are requested, they shouldn't be requested again. My approach is to simply check if the Redux store already contains that homeworld, and request only if it doesn't. In conjunction, i leveraged lodash's *uniqBy* method, to filter out repeated homeworlds per page of characters. During development I logged to see there were no duplicate calls to the same homeworlds.

## The dilemma of paging vs sorting
As per requirement of this project, the app should return an alphabetically sorted list of character based on their names. The dilemma hence arisen: *if i were to display already received pages as sorted, then any addition of characters will disrupt the order of the whole list, and in order to avoid that, i must fetch all pages consecutively, but the loading time is so long*. After some thoughts, between long start up time, and a disruptive presentation, i have chosen the latter, as a lesser of two evils. As an average app user myself i just **don't want** to wait on a mobile app when the underlying reason of any mobile apps is because they're supposed to be fast/lag free, however your call it.

In an ideal scenario, the returning data should be already sorted, perhaps by whatever parameters passed into the request. I personally haven't had the courtesy to contact the maintainers of StarWars API to make accordingly changes, and so this will be one shortcoming of this app.

## Spinners
This one will be short. I totally don't adopt modals like i once did, and instead embed spinners here and there while users can still interact with the app. Because the next thing i hate other than waiting for initiation time, is being blocked from interacting with the app whatsoever.

## Possible further developments

1. ***The problem of concurrent requests.*** It is partially implemented at the moment: when bulking retrieving homeworlds. However, this bulk of request is blocking the calls to the next characters page. *And many miles to go before i sleep* 

2. ***Have an already sorted list per request.*** It's possible to host one's own Nodejs server that takes all the StarWars data and have the app retrieve from it instead. But…that adds an extra layer of infrastructure, potentially further slowing things down, seems to be rather counterproductive. So it would be best to have to origin APIs improved.

3. ***Show avatars in main Characters list.*** And perhaps due to the graphical load, the size of each character item could be increased to relief renders at a time. Show more information on character, their homeworlds and more on the Character's detail screen.

4. ***implement transitional animations*** while navigating from list to details screen

## Tests
As the time of development, test are done manually. I know, i'll pick that up shortly...
