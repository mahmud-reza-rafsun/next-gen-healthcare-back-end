import z from "zod";

export const createScheduleZodSchema = z.object({
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Expected format: YYYY-MM-DD"
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Expected format: YYYY-MM-DD"
    }),
    startTime: z.string().refine((time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time), {
        message: "Invalid time format. Expected format: HH:mm (24-hour)"
    }),
    endTime: z.string().refine((time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time), {
        message: "Invalid time format. Expected format: HH:mm (24-hour)"
    })
});

export const updateScheduleZodSchema = z.object({
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Expected format: YYYY-MM-DD"
    }).optional(),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Expected format: YYYY-MM-DD"
    }).optional(),
    startTime: z.string().refine((time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time), {
        message: "Invalid time format. Expected format: HH:mm (24-hour)"
    }).optional(),
    endTime: z.string().refine((time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time), {
        message: "Invalid time format. Expected format: HH:mm (24-hour)"
    }).optional()
})