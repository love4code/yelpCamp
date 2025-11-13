const campListItems = document.querySelectorAll('.camp-list-item'); // campgrounds/index
const showEditButton = document.getElementById('showEditButton'); // show view
const showDeleteButton = document.getElementById('showDeleteButton'); // show view

// function to add eventlistener to each camp list item
const addEventToCampListItems = (campListItems) => {
  // add eventlistener to each camp list item
  campListItems.forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');
      window.location.href = `/campgrounds/${id}`;
    });
  });
};

//function to add eventlistener to show delete button
const addEventToShowDeleteButton = (showDeleteButton) => {
  showDeleteButton.addEventListener('click', () => {
    const id = showDeleteButton.getAttribute('data-id');
    axios.delete(`/campgrounds/${id}`).then((data) => {
      window.location.href = '/campgrounds';
    });
  });
};

const addEventToShowEditButton = (showEditButton) => {
  showEditButton.addEventListener('click', () => {
    const id = showEditButton.getAttribute('data-id');
    window.location.href = `/campgrounds/${id}/edit`;
  });
};
// check if campListItems is not null and has addEventListener method
// if it does, add eventlistener to each camp list item
if (campListItems !== null && campListItems.addEventListener !== null) {
  addEventToCampListItems(campListItems);
}

if (showDeleteButton !== null && showDeleteButton.addEventListener !== null) {
  addEventToShowDeleteButton(showDeleteButton);
}

if (showEditButton !== null && showEditButton.addEventListener !== null) {
  addEventToShowEditButton(showEditButton);
}
