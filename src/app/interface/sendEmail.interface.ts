/* eslint-disable @typescript-eslint/no-explicit-any */
export interface sendEmailInterface {
    to: string,
    subject: string,
    templeteName: string,
    templeteData: Record<string, any>,
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}