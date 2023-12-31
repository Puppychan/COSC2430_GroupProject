// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Authors: Tran Mai Nhung - s3879954
//          Tran Nguyen Ha Khanh - s3877707
//          Nguyen Vinh Gia Bao - s3986287
//          Ton That Huu Luan - s3958304
//          Ho Van Khoa - s3997024
// Acknowledgement: 
function decrement(decreaseAction) {
  const btn = decreaseAction.target.parentNode.parentElement.querySelector(
    'button[data-action="decrement"]'
  );
  const target = btn.nextElementSibling;
  let value = Number(target.value);

  // Check if the value is greater than or equal to a minimum value (e.g., 0)
  if (value > 0) {
    value--;
    target.value = value;
  }
}

function increment(increaseAction) {
  const btn = increaseAction.target.parentNode.parentElement.querySelector(
    'button[data-action="decrement"]'
  );
  const target = btn.nextElementSibling;
  let value = Number(target.value);
  value++;
  target.value = value;
}

const decrementButtons = document.querySelectorAll(
  `button[data-action="decrement"]`
);

const incrementButtons = document.querySelectorAll(
  `button[data-action="increment"]`
);

decrementButtons.forEach(btn => {
  btn.addEventListener("click", decrement);
});

incrementButtons.forEach(btn => {
  btn.addEventListener("click", increment);
});


//Remove function
// Get all the "Remove" buttons
function removeItem(remove) {
  // Find the parent list item (<li>) of the clicked "Remove" button
  const listItem = remove.closest("li");

  // Remove the list item from the cart
  if (listItem) {
    listItem.remove();
  }
}