function API() {
    const url = "http://localhost:3000/events";
    const getEvents = async() => {
        const res = await fetch(`${url}`);
        return await res.json();
    }
    
    const postEvent = async(event) => {
        const res = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(event)
        });
        return await res.json();
    }

    const deleteEvent = async(id) => {
        const res = await fetch(`${url}/${id}`, {
            method: "DELETE"
        });
        return await res.json();
    }

    const putEvent = async (id, updatedEvent) => {
        const res = await fetch(`${url}/${id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(updatedEvent)
        });
        return await res.json();
      };

    return {
        getEvents,
        postEvent,
        deleteEvent,
        putEvent
    }
}

class EventModel {
    #events = [];
    constructor() {};

    getEvents() {
        return this.#events;
    }

    async fetchEvents() {
        this.#events = await API().getEvents();
    }

    async addEvent(newEvent) {
        const event = await API().postEvent(newEvent);
        this.#events.push(event);
        return event;
    }

    async removeEvent(id) {
        const removeId = await API().deleteEvent(id);
        this.#events = this.#events.filter(event => event.id != id);
        return removeId;
    }

    async updateEvent(id, updatedEvent) {
        const updated = await API().putEvent(id, updatedEvent);
        const idx = this.#events.findIndex(event => event.id === id);
        if (idx !== -1) {
            this.#events[idx] = updated;
        }
        return updated;
    }
}

class EventView {
    constructor() {
        this.addBtn = document.querySelector(".eventlist-app__addBtn");
        this.table = document.querySelector(".eventlist-app__table");
        this.eventlist = document.querySelector(".eventlist-app__table-body");
    }

    initRenderEvents(events) {
        this.eventlist.innerHTML = "";
        events.forEach(event => {
            this.appendEvent(event);
            document.getElementById(`startDate-${event.id}`).value = event.startDate;
            document.getElementById(`endDate-${event.id}`).value = event.endDate;
        });
    }

    appendEvent(event) {
        const element = this.createEvent(event);
        this.eventlist.append(element);
    }

    createEvent(event) {
        const element = document.createElement("tr");
        element.classList.add("eventElement");
        element.setAttribute("id", `event-${event.id}`);

        const eventName = document.createElement("td");
        eventName.classList.add("eventName");
        eventName.setAttribute("id", `eventName-${event.id}`);
        eventName.textContent = event.eventName;

        const startDateArea = document.createElement("td");
        const startDate = document.createElement("input");
        startDate.classList.add("startDate");
        startDate.setAttribute("id", `startDate-${event.id}`);
        startDate.setAttribute("type", "date");
        startDate.textContent = event.startDate;
        startDateArea.append(startDate);

        const endDateArea = document.createElement("td");
        const endDate = document.createElement("input");
        endDate.classList.add("endDate");
        endDate.setAttribute("id", `endDate-${event.id}`);
        endDate.setAttribute("type", "date");
        endDate.textContent = event.endDate;
        endDate.contentEditable = false;
        endDateArea.append(endDate);

        const editButton = document.createElement("button");
        editButton.classList.add("event__edit-btn");
        editButton.setAttribute("edit-id", event.id);
        editButton.setAttribute("id", `edit-${event.id}`);
        editButton.textContent = "edit";
        // editButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>`;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("event__delete-btn");
        deleteButton.setAttribute("delete-id", event.id);
        deleteButton.setAttribute("id", `delete-${event.id}`);
        deleteButton.textContent = "delete";
        // deleteButton.innerHTML= `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`

        element.append(eventName, startDateArea, endDateArea, editButton, deleteButton);
        return element;
    }

    removeEvent(id) {
        const element = document.getElementById(`event-${id}`);
        element.remove();
    }

    editEvent(id) {
        const editBtn = document.getElementById(`edit-${id}`);
        editBtn.textContent = "save";
        const deleteBtn = document.getElementById(`delete-${id}`);
        deleteBtn.classList.add("event__cancel-btn");
        deleteBtn.textContent = "cancel";
        const eventName = document.getElementById(`eventName-${id}`);
        eventName.contentEditable = true;
        const startDate = document.getElementById(`startDate-${id}`);
        startDate.contentEditable = true;
        const endDate = document.getElementById(`endDate-${id}`);
        endDate.contentEditable = true;
    }

    addEvent(id) {
        const editBtn = document.getElementById(`edit-${id}`);
        editBtn.textContent = "add";
        const deleteBtn = document.getElementById(`delete-${id}`);
        // deleteBtn.classList.add("event__cancel-btn");
        deleteBtn.textContent = "cancel";
        const eventName = document.getElementById(`eventName-${id}`);
        eventName.contentEditable = true;
        const startDate = document.getElementById(`startDate-${id}`);
        startDate.contentEditable = true;
        const endDate = document.getElementById(`endDate-${id}`);
        endDate.contentEditable = true;
    }

    updateEvent(id) {
        const editBtn = document.getElementById(`edit-${id}`);
        editBtn.textContent = "edit";
        const deleteBtn = document.getElementById(`delete-${id}`);
        deleteBtn.classList.remove("event__cancel-btn");
        deleteBtn.textContent = "delete";
        const eventName = document.getElementById(`eventName-${id}`);
        eventName.contentEditable = false;
        const startDate = document.getElementById(`startDate-${id}`);
        startDate.contentEditable = false;
        const endDate = document.getElementById(`endDate-${id}`);
        endDate.contentEditable = false;
    }
}

class EventController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    async init() {
        this.setUpEvents();
        await this.model.fetchEvents();
        this.view.initRenderEvents(this.model.getEvents());
    }

    setUpEvents() {
        this.setUpAddEvent();
        this.setUpDeleteEvent();
        this.setUpUpdateEvent();
    }

    setUpAddEvent() {
        this.view.addBtn.addEventListener("click", async () => {
            const event = {
                eventName: "",
                startDate: "",
                endDate: ""
            }
            
            const newEvent = await this.model.addEvent(event);
            this.view.appendEvent(newEvent);
            this.view.addEvent(newEvent.id);
            this.view.eventlist.addEventListener("click", this.saveUpdateEvent.bind(this, newEvent.id));

        })
    }

    setUpDeleteEvent() {
        this.view.eventlist.addEventListener("click", (e) => {
          const isDeleteBtn = e.target.classList.contains("event__delete-btn") && !e.target.classList.contains("event__cancel-btn");
          if (isDeleteBtn) {
            const removeId = e.target.getAttribute("delete-id");
            this.model.removeEvent(removeId).then(() => {
                this.view.removeEvent(removeId);
            });
          }
        });
    }

    setUpUpdateEvent() {
        this.view.eventlist.addEventListener("click", (e) => {
            const isEditBtn = e.target.classList.contains("event__edit-btn");
            if (isEditBtn) {
                const editId = e.target.getAttribute("edit-id");
                const id = editId.replace("edit-", "");
                this.view.editEvent(id);
                this.view.eventlist.removeEventListener("click", this.saveUpdateEvent);
                this.view.eventlist.removeEventListener("click", this.cancelUpdateEvent);

                this.view.eventlist.addEventListener("click", this.saveUpdateEvent.bind(this, id));
                this.view.eventlist.addEventListener("click", this.cancelUpdateEvent.bind(this, id));
            }
        });
    }

    
    saveUpdateEvent(id, e) {
        const isEditBtn = e.target.classList.contains("event__edit-btn");
        if (isEditBtn) {
            const updatedEvent = {
                eventName: document.getElementById(`eventName-${id}`).textContent,
                startDate: document.getElementById(`startDate-${id}`).value,
                endDate: document.getElementById(`endDate-${id}`).value                
            };
            this.model.updateEvent(id, updatedEvent).then(() => {
                this.view.updateEvent(id);
            });
            this.view.eventlist.removeEventListener("click", this.saveUpdateEvent);       
            
            this.view.eventlist.removeEventListener("click", this.cancelUpdateEvent);  
            this.view.eventlist.addEventListener("click", this.setUpUpdateEvent);       
        }
    }


    cancelUpdateEvent(id, e) {
        const isCancelBtn = e.target.classList.contains("event__cancel-btn");
        if (isCancelBtn) {
          this.view.updateEvent(id);
        }
        this.view.eventlist.removeEventListener("click", this.saveUpdateEvent);
        this.view.eventlist.removeEventListener("click", this.cancelUpdateEvent);
        this.view.eventlist.addEventListener("click", this.setUpUpdateEvent);    
    }
      


      
 }

const model = new EventModel();
const view = new EventView();
const controller = new EventController(model, view);