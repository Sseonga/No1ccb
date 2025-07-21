package fs.human.ecospot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
@MapperScan("fs.human.ecospot.*.dao")
public class EcospotApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcospotApplication.class, args);
	}

}
