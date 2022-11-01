FROM golang:1.19.2 As go_builder

WORKDIR /home/app

COPY . .

RUN go build main.go

FROM scratch 

WORKDIR /home/app

COPY --from=go_builder /home/app .

ENTRYPOINT [ "./main" ]