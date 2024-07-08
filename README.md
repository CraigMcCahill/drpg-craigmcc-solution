# DRPG Coding Test - Craig McCahill

## Run app

    npm run start


## Test

    npm run test

## Approach

* Two simple components one for dashboard itself and one for the edit form 
* Added packages for the table and modal- these are common UI elements that are best handled by 3rd party libs
* Using hooks - useEffect for calling the API itself and useMemo for table rendering
* Have tried to cover as much logic in the two components as possible by mocking the API
* Search and pagination is very naive

## Improvements I would add

* Search is extremely naive and only searches the current page - ideally there would be a way of searching through the API - but I could not see one. Failing that the users on each page could be concatenated together and filtered - BUT this would not very efficient as the list became longer.
* Move search to a separate component
* Search could be fuzzy
* Pagination should show the number of pages allowing you to click on an individual page
* Add test for opening and closing the modal 
* Add test for loading in the edit details form
* UX is terrible (no mobile view, fails accessibility tests etc) but I understand this wasn't part of the test
