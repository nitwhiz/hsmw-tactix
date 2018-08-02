package io.milotic.tactix.server;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class FileHandler implements HttpHandler {
	
	private Path path = null;
	
	public FileHandler(String path) {
		this.path = Paths.get(path);
	}

	@Override
	public void handle(HttpExchange exchange) throws IOException {
		byte[] response = Files.readAllBytes(this.path);
		
		exchange.sendResponseHeaders(200, response.length);
		
		OutputStream os = exchange.getResponseBody();
		
		System.out.println("[" + new Date() + "] " + "Serving `" + this.path.toUri() + "` (" + response.length + " bytes)");
		
		os.write(response);
		os.close();
	}

}
