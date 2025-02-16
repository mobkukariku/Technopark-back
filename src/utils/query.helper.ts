export const getQueryOptions = (query: any) => {
    const { limit, page, sort, search } = query;

    let filter: any = {};
    if (search) {
        const searchWords = (search as string).trim().split(/\s+/);

        filter.$and = searchWords.map(word => ({
            $or: [
                { title: { $regex: search, $options: "i" }},
                { description: { $regex: search, $options: "i" }},
            ]
        }));
    }

    let sortOption = {};
    if (sort === "newest") {
        sortOption = { createdAt: -1 };
    } else if (sort === "oldest") {
        sortOption = { createdAt: 1 };
    }

    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    return { filter, sortOption, skip, pageSize, pageNumber,  };
};
