export interface TaskModel {
    id: string
    title: string,
    description: string,
    dueDate: Date,
    start: Date,
    end: Date,
    uids: string[],
    color?: string,
    attachments: Attachment[],
    progress?: number
}

export interface Attachment {
    name: string,
    url: string,
    size: number,
    type?: string
}