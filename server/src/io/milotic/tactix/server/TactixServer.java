package io.milotic.tactix.server;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.sun.net.httpserver.HttpServer;

public class TactixServer {
	
	public static ArrayList<String> contexts;
	
	private static ArrayList<String> sniffFiles(File[] list, String relativity) {
		ArrayList<String> files = new ArrayList<String>();
		
		for(File f : list) {
			if(f.isDirectory()) {
				ArrayList<String> subFiles = sniffFiles(f.listFiles(), relativity);
				
				files.addAll(subFiles);
			} else {
				files.add(f.getPath().replace("\\", "/").replace(relativity, ""));
			}
		}
		
		return files;
	}
	
	public static void main(String[] args) throws IOException {
		int port = 8000;
		String wwwRootPath = "./www/";
		String normalizedRootPath = wwwRootPath.replace("\\", "/");
		
		HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
		
		File wwwRoot = new File(wwwRootPath);
		File[] wwwList = wwwRoot.listFiles();
		
		contexts = new ArrayList<String>();
		
		final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
		
		scheduler.scheduleAtFixedRate(new Runnable() {

			@Override
			public void run() {
				ArrayList<String> finalFileList = sniffFiles(wwwList, wwwRootPath);
				
				for(String file : finalFileList) {
					if(!contexts.contains(file)) {
						System.out.println("Creating context `" + "/" + file + "`...");
						
						server.createContext("/" + file, new FileHandler(normalizedRootPath + file));
						
						contexts.add(file);
					}
				}
			}
			
		}, 0, 1000, TimeUnit.MILLISECONDS);
		
		server.createContext("/play", new FileHandler(normalizedRootPath + "index.html"));
		
		server.start();
		
		System.out.println("Server listening on `localhost:" + port + "`, serving `" + normalizedRootPath + "`!");
	}

}
