export async function POST(req: Request) {

  try {

    const formData =
      await req.formData();

    const file =
      formData.get("file") as File;

    if (!file) {

      return Response.json(
        {
          error:
            "No file uploaded",
        },
        { status: 400 }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const text =
      Buffer.from(bytes)
        .toString("utf-8");

    return Response.json({
      text,
    });

  } catch (error) {

    console.error(
      "UPLOAD ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Upload failed",
      },
      { status: 500 }
    );
  }
}