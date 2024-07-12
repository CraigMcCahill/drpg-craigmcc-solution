# DRPG Coding Test - Craig McCahill

## Run app

    npm run start


## Test

    npm run test

## Approach 

The logic of the app has been abstracted out of the components into reusable, testable custom hooks:

* useFetch - wraps data fetching from the API
* useUsers (could have a better name?) - encapsulates the handling of getting, setting and filtering the user data for search
* useDebounce - adds a debouncing hook for performance of the search field
* useUpdateUser - this hook contains the logic of the updating and submitting of the form

The main component is the Dashboard - this is now composed of smaller reusable components:

* Pagination - a fuller pagination component
* Search - now using the debounce hook

UpdateUser has remained its own component but with the logic moved into the custom hook.

## Improvements I would add

* Search is still naive and only searches the current page - ideally there would be a way of searching through the API - but I could not see one. Failing that the users on each page could be concatenated together and filtered - BUT this would not very efficient as the list became longer.
* Search could be fuzzy
* Add test for opening and closing the modal 
* Add test for loading in the edit details form
* UX is terrible (no mobile view, fails accessibility tests etc) but I understand this wasn't part of the test
