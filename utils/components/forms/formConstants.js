export const eventForm = [{
    id: 'name',
    type: 'text',
    placeholder: 'Event Name',
    required: true
}, {
    id: 'description',
    type: 'text',
    placeholder: 'Description (Optional)',
    required: false
}, {
    id: 'start',
    type: 'datetime-local',
    placeholder: 'Event Start',
    required: true
}, {
    id: 'end',
    type: 'datetime-local',
    placeholder: 'Event End',
    required: true
}];
export const projectForm = [{
    id: 'name',
    type: 'text',
    placeholder: 'Project Name',
    required: true
}, {
    id: 'description',
    type: 'text',
    placeholder: 'Description (Optional)',
    required: false
}, {
    id: 'minutes',
    type: 'number',
    placeholder: 'Minutes Required',
    required: true,
    min: 0
}, {
    id: 'due',
    type: 'datetime-local',
    placeholder: 'Due Date',
    required: true
}];
export const loginForm = [{
    id: 'email',
    type: 'email',
    placeholder: 'Email',
    required: true
}, {
    id: 'password',
    type: 'password',
    placeholder: 'Password',
    required: true
}]
export const signupForm = [{
    id: 'username',
    type: 'text',
    placeholder: 'Display Name',
    required: true,
    minLength: 3,
    maxLength: 30
}, {
    id: 'email',
    type: 'email',
    placeholder: 'Email',
    required: true
}, {
    id: 'password',
    type: 'password',
    placeholder: 'Password',
    required: true
}]