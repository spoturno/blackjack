export async function getAllUsers(request, response) {
    console.log('getAllUsers');
    return response.status(200).json({ message: 'getAllUsers' });
}

export async function createUser(request, response) {
    console.log('createUser');
    return response.status(200).json({ message: 'createUser' });
}