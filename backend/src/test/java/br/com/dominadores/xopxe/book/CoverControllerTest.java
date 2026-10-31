package br.com.dominadores.xopxe.book;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/** Testes do upload da capa. */
// Com @Transactional o que o teste salva no banco é desfeito no final.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CoverControllerTest {

	private static final byte[] PNG = { (byte) 0x89, 'P', 'N', 'G' };

	@Autowired
	private MockMvc mockMvc;

	@Test
	@WithMockUser(roles = "ADMIN")
	void adminUploadsAndAnyoneCanSeeTheCover() throws Exception {
		var file = new MockMultipartFile("file", "capa.png", "image/png", PNG);

		String body = mockMvc.perform(multipart("/api/books/covers").file(file))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.url").value(org.hamcrest.Matchers.matchesPattern(CoverController.URL_PATTERN)))
				.andReturn().getResponse().getContentAsString();
		String url = JsonPath.read(body, "$.url");

		mockMvc.perform(get(url))
				.andExpect(status().isOk())
				.andExpect(content().contentType("image/png"))
				.andExpect(content().bytes(PNG));
	}

	@Test
	@WithMockUser(roles = "ADMIN")
	void rejectsFilesThatAreNotImages() throws Exception {
		var file = new MockMultipartFile("file", "capa.svg", "image/svg+xml", "<svg/>".getBytes());

		mockMvc.perform(multipart("/api/books/covers").file(file))
				.andExpect(status().isBadRequest());
	}

	@Test
	@WithMockUser(roles = "ADMIN")
	void rejectsFileWithoutType() throws Exception {
		var file = new MockMultipartFile("file", "capa.png", null, PNG);

		mockMvc.perform(multipart("/api/books/covers").file(file))
				.andExpect(status().isBadRequest());
	}

	@Test
	@WithMockUser(roles = "USER")
	void commonUserCannotUpload() throws Exception {
		var file = new MockMultipartFile("file", "capa.png", "image/png", PNG);

		mockMvc.perform(multipart("/api/books/covers").file(file))
				.andExpect(status().isForbidden());
	}
}
