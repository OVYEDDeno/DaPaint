export function ValidateDateTime (dateTime, setInvalidItems) {
    console.log(dateTime)
    var currentDate = new Date();
    let formattedCurrentDate = new Date(dateTime)
    console.log(currentDate)
    console.log(formattedCurrentDate)

    if (formattedCurrentDate <= currentDate || dateTime.trim() === "" || dateTime.length <= 6 || dateTime.length > 20 ) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "dateTime"]);
        return false;
    }

    return true;
}
<input
                className="form-control"
                name="dateTime"
                placeholder="dateTime"
                type="date"
                onChange={(event) => {
                  const newDate = event.target.value;
                  setEstCompletion(newDate)
                }}
                value={DateTime}
              />