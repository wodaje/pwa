
const req = indexedDB.open("offline")
let db

request.onupgradeneeded = function () {
  db = request.result
  db.createObjectStore("pending", { autoIncrement: true })
}

request.onsuccess = function () {
db = request.result

  if (navigator.onLine) {
    updateDB()
  }
}

request.onerror = function () {
  console.log("Error: " + request.errorCode)
}

function saveRec(write) {
  const transaction = db.transaction(["pending"], "readwrite")
  const store = transaction.objectStore("pending")

  store.add(write)
}

function updateDB() {
  db = request.results

  let transaction = db.transaction(["pending"], "readwrite")
  let store = transaction.objectStore("pending")
  const getAll = store.getAll()

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        }
      })
        .then((res) => res.json())

        .then(() => {

          transaction = db.transaction(["pending"], "readwrite")
          store = transaction.objectStore("pending")
          store.clear()

        })
    }
  }
}


window.addEventListener("online", updateDB)